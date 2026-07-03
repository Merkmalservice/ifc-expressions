import { CharStream, CommonTokenStream, ParserRuleContext } from "antlr4ng";
import {
  BuiltinMemberDefinition,
  BuiltinVariableRegistry,
} from "../builtin/BuiltinVariableRegistry.js";
import { IfcExpressionLexer } from "../gen/parser/IfcExpressionLexer.js";
import { IfcExpressionParser } from "../gen/parser/IfcExpressionParser.js";
import { ContextObjectType } from "../type/ContextObjectType.js";
import { ExprType } from "../type/ExprType.js";
import { CompletionItem, CompletionResult } from "./CompletionItem.js";

export type IfcExpressionAutocompleteOptions = {
  builtinVariableRegistry?: BuiltinVariableRegistry;
};

type PathSegment =
  | {
      name: string;
      kind: "property";
    }
  | {
      name: string;
      kind: "function";
      argumentCount: number;
    };

const AUTOCOMPLETE_CURSOR_IDENTIFIER = "__IFC_AUTOCOMPLETE_CURSOR__";

function isIdentifierChar(char: string | undefined): boolean {
  return typeof char === "string" && /[a-zA-Z0-9_\-$&]/.test(char);
}

function isQuoted(char: string, quoteChar: string, input: string, index: number) {
  if (char !== quoteChar) {
    return false;
  }

  let backslashCount = 0;
  let i = index - 1;
  while (i >= 0 && input[i] === "\\") {
    backslashCount++;
    i--;
  }

  return backslashCount % 2 === 0;
}

function toBuiltinLabel(name: string): string {
  return name.startsWith("$") ? name : `$${name}`;
}

function normalizeForMatch(value: string): string {
  return value.toUpperCase();
}

function toCompletionTypeName(type: ExprType): string {
  return type.getName().replace(/^\$/, "");
}

function isChainableType(type: ExprType): boolean {
  return type instanceof ContextObjectType;
}

function findBuiltinRootReplaceRange(
  input: string,
  cursorOffset: number
): { from: number; to: number } | undefined {
  const cursor = Math.max(0, Math.min(cursorOffset, input.length));
  let i = cursor - 1;

  while (i >= 0 && isIdentifierChar(input[i]) && input[i] !== "$") {
    i--;
  }

  if (i >= 0 && input[i] === "$") {
    return { from: i, to: cursor };
  }

  return undefined;
}

function createMemberCompletionProbe(
  input: string,
  cursorOffset: number
): { probeInput: string; from: number; to: number } | undefined {
  const cursor = Math.max(0, Math.min(cursorOffset, input.length));
  let from = cursor;

  while (from > 0 && isIdentifierChar(input[from - 1])) {
    from--;
  }

  if (from === 0 || input[from - 1] !== ".") {
    return undefined;
  }

  let tokenEnd = cursor;
  while (tokenEnd < input.length && isIdentifierChar(input[tokenEnd])) {
    tokenEnd++;
  }

  return {
    probeInput:
      input.slice(0, from) +
      AUTOCOMPLETE_CURSOR_IDENTIFIER +
      input.slice(tokenEnd),
    from,
    to: cursor,
  };
}

function methodAccessorText(methodAccessor: any): string | undefined {
  switch (methodAccessor?.constructor?.name) {
    case "MethodPropertyAccessContext":
      return methodAccessor.IDENTIFIER()?.getText();
    case "MethodFunctionCallContext":
      return methodAccessor.functionCall()?.getText();
    default:
      return undefined;
  }
}

function collectMethodAccessorTexts(methodCallChain: any): Array<string> | undefined {
  if (!methodCallChain) {
    return undefined;
  }

  switch (methodCallChain.constructor?.name) {
    case "MethodCallChainEndContext": {
      const text = methodAccessorText(methodCallChain.methodAccessor());
      return text ? [text] : undefined;
    }
    case "MethodCallChainInnerContext": {
      const current = methodAccessorText(methodCallChain.methodAccessor());
      const rest = collectMethodAccessorTexts(methodCallChain.methodCallChain());
      if (!current || !rest) {
        return undefined;
      }
      return [current, ...rest];
    }
    default:
      return undefined;
  }
}

function extractBuiltinObjectPathFromSingleExpr(singleExpr: any): string | undefined {
  switch (singleExpr?.constructor?.name) {
    case "SEVariableRefContext": {
      const identifier = singleExpr.variableRef()?.IDENTIFIER()?.getText();
      return identifier ? `$${identifier}` : undefined;
    }
    case "SEMethodCallContext": {
      const base = extractBuiltinObjectPathFromSingleExpr(singleExpr.singleExpr());
      const accessors = collectMethodAccessorTexts(singleExpr.methodCallChain());
      if (!base || !accessors) {
        return undefined;
      }
      return [base, ...accessors].join(".");
    }
    default:
      return undefined;
  }
}

function findMemberAccessContextByParser(
  input: string,
  cursorOffset: number
): { objectPath: string; from: number; to: number } | undefined {
  const probe = createMemberCompletionProbe(input, cursorOffset);
  if (!probe) {
    return undefined;
  }

  try {
    const chars = CharStream.fromString(probe.probeInput);
    const lexer = new IfcExpressionLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new IfcExpressionParser(tokens);
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    const parseTree = parser.expr();
    const objectPath = findCompletionObjectPath(parseTree);

    if (!objectPath) {
      return undefined;
    }

    return {
      objectPath,
      from: probe.from,
      to: probe.to,
    };
  } catch {
    return undefined;
  }
}

function findCompletionObjectPath(node: ParserRuleContext): string | undefined {
  if (node.constructor?.name === "SEMethodCallContext") {
    const accessors = collectMethodAccessorTexts((node as any).methodCallChain());
    if (accessors?.at(-1) === AUTOCOMPLETE_CURSOR_IDENTIFIER) {
      const base = extractBuiltinObjectPathFromSingleExpr((node as any).singleExpr());
      if (!base) {
        return undefined;
      }

      return [base, ...accessors.slice(0, -1)].join(".");
    }
  }

  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i);
    if (child instanceof ParserRuleContext) {
      const objectPath = findCompletionObjectPath(child);
      if (objectPath) {
        return objectPath;
      }
    }
  }

  return undefined;
}

function findMemberAccessContext(
  input: string,
  cursorOffset: number
): { objectPath: string; from: number; to: number } | undefined {
  return findMemberAccessContextByParser(input, cursorOffset);
}

function getMemberResultType(definition: BuiltinMemberDefinition): ExprType {
  return definition.kind === "property"
    ? definition.valueType
    : definition.returnType;
}

function splitObjectPath(objectPath: string): Array<string> | undefined {
  const segments: Array<string> = [];
  let current = "";
  let singleQuoted = false;
  let doubleQuoted = false;
  let parenthesisDepth = 0;

  for (let i = 0; i < objectPath.length; i++) {
    const char = objectPath[i];

    if (singleQuoted) {
      current += char;
      if (isQuoted(char, "'", objectPath, i)) {
        singleQuoted = false;
      }
      continue;
    }

    if (doubleQuoted) {
      current += char;
      if (isQuoted(char, '"', objectPath, i)) {
        doubleQuoted = false;
      }
      continue;
    }

    if (isQuoted(char, "'", objectPath, i)) {
      singleQuoted = true;
      current += char;
      continue;
    }

    if (isQuoted(char, '"', objectPath, i)) {
      doubleQuoted = true;
      current += char;
      continue;
    }

    if (char === "(") {
      parenthesisDepth++;
      current += char;
      continue;
    }

    if (char === ")") {
      if (parenthesisDepth === 0) {
        return undefined;
      }
      parenthesisDepth--;
      current += char;
      continue;
    }

    if (char === "." && parenthesisDepth === 0) {
      const trimmed = current.trim();
      if (trimmed.length === 0) {
        return undefined;
      }
      segments.push(trimmed);
      current = "";
      continue;
    }

    current += char;
  }

  if (singleQuoted || doubleQuoted || parenthesisDepth !== 0) {
    return undefined;
  }

  const trimmed = current.trim();
  if (trimmed.length > 0) {
    segments.push(trimmed);
  }

  return segments;
}

function countCallArguments(argumentList: string): number | undefined {
  const trimmed = argumentList.trim();
  if (trimmed.length === 0) {
    return 0;
  }

  let count = 1;
  let singleQuoted = false;
  let doubleQuoted = false;
  let parenthesisDepth = 0;
  let bracketDepth = 0;

  for (let i = 0; i < argumentList.length; i++) {
    const char = argumentList[i];

    if (singleQuoted) {
      if (isQuoted(char, "'", argumentList, i)) {
        singleQuoted = false;
      }
      continue;
    }

    if (doubleQuoted) {
      if (isQuoted(char, '"', argumentList, i)) {
        doubleQuoted = false;
      }
      continue;
    }

    if (isQuoted(char, "'", argumentList, i)) {
      singleQuoted = true;
      continue;
    }

    if (isQuoted(char, '"', argumentList, i)) {
      doubleQuoted = true;
      continue;
    }

    if (char === "(") {
      parenthesisDepth++;
      continue;
    }

    if (char === ")") {
      if (parenthesisDepth === 0) {
        return undefined;
      }
      parenthesisDepth--;
      continue;
    }

    if (char === "[") {
      bracketDepth++;
      continue;
    }

    if (char === "]") {
      if (bracketDepth === 0) {
        return undefined;
      }
      bracketDepth--;
      continue;
    }

    if (char === "," && parenthesisDepth === 0 && bracketDepth === 0) {
      count++;
    }
  }

  if (singleQuoted || doubleQuoted || parenthesisDepth !== 0 || bracketDepth !== 0) {
    return undefined;
  }

  return count;
}

function parsePathSegment(segment: string): PathSegment | undefined {
  const propertyMatch = /^(?<name>[a-zA-Z0-9_\-$&]+)$/.exec(segment);
  if (propertyMatch?.groups?.name) {
    return {
      name: propertyMatch.groups.name,
      kind: "property",
    };
  }

  const functionMatch = /^(?<name>[a-zA-Z0-9_\-$&]+)\((?<args>.*)\)$/.exec(segment);
  if (!functionMatch?.groups?.name || functionMatch.groups.args === undefined) {
    return undefined;
  }

  const argumentCount = countCallArguments(functionMatch.groups.args);
  if (argumentCount === undefined) {
    return undefined;
  }

  return {
    name: functionMatch.groups.name,
    kind: "function",
    argumentCount,
  };
}

function resolveObjectPathType(
  objectPath: string,
  builtinVariableRegistry: BuiltinVariableRegistry
): ExprType | undefined {
  const pathParts = splitObjectPath(objectPath);
  if (!pathParts || pathParts.length === 0) {
    return undefined;
  }

  let currentType = builtinVariableRegistry.getDefinition(pathParts[0])?.type;
  for (const rawPart of pathParts.slice(1)) {
    if (!(currentType instanceof ContextObjectType)) {
      return undefined;
    }

    const pathSegment = parsePathSegment(rawPart);
    if (!pathSegment) {
      return undefined;
    }

    const memberDefinition = currentType.getMemberDefinition(pathSegment.name);
    if (!memberDefinition) {
      return undefined;
    }

    if (pathSegment.kind === "property" && memberDefinition.kind === "function") {
      return undefined;
    }

    if (pathSegment.kind === "function") {
      if (memberDefinition.kind !== "function") {
        return undefined;
      }

      if (memberDefinition.argumentTypes.length !== pathSegment.argumentCount) {
        return undefined;
      }
    }

    currentType = getMemberResultType(memberDefinition);
  }

  return currentType;
}

function toFunctionInsertText(name: string): string {
  return `${name}()`;
}

function toMemberItem(definition: BuiltinMemberDefinition): CompletionItem {
  if (definition.kind === "property") {
    return {
      kind: "builtinMemberProperty",
      label: definition.name,
      returnTypeName: toCompletionTypeName(definition.valueType),
      chainable: isChainableType(definition.valueType),
    };
  }

  const insertText = toFunctionInsertText(definition.name);

  return {
    kind: "builtinMemberFunction",
    label: definition.name,
    insertText,
    cursorOffset: insertText.length - 1,
    argumentTypeNames: definition.argumentTypes.map((type) => type.getName()),
    returnTypeName: toCompletionTypeName(definition.returnType),
    chainable: isChainableType(definition.returnType),
  };
}

export class IfcExpressionAutocomplete {
  public static complete(
    input: string,
    cursorOffset: number,
    options: IfcExpressionAutocompleteOptions = {}
  ): CompletionResult {
    const builtinVariableRegistry =
      options.builtinVariableRegistry ?? BuiltinVariableRegistry.getDefaultRegistry();

    const memberContext = findMemberAccessContext(input, cursorOffset);
    if (memberContext) {
      const objectType = resolveObjectPathType(
        memberContext.objectPath,
        builtinVariableRegistry
      );
      if (!(objectType instanceof ContextObjectType)) {
        return {
          items: [],
          replaceFrom: memberContext.from,
          replaceTo: memberContext.to,
        };
      }

      const typedPrefix = normalizeForMatch(
        input.slice(memberContext.from, memberContext.to)
      );
      const items = objectType
        .getMemberDefinitions()
        .map(toMemberItem)
        .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
        .sort((left, right) => left.label.localeCompare(right.label));

      return {
        items,
        replaceFrom: memberContext.from,
        replaceTo: memberContext.to,
      };
    }

    const range = findBuiltinRootReplaceRange(input, cursorOffset);
    if (!range) {
      return {
        items: [],
        replaceFrom: cursorOffset,
        replaceTo: cursorOffset,
      };
    }

    const typedPrefix = normalizeForMatch(input.slice(range.from, range.to));

    const items: Array<CompletionItem> = builtinVariableRegistry
      .getDefinitions()
      .map((definition) => ({
        kind: "builtinRoot" as const,
        label: toBuiltinLabel(definition.name),
      }))
      .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
      .sort((left, right) => left.label.localeCompare(right.label));

    return {
      items,
      replaceFrom: range.from,
      replaceTo: range.to,
    };
  }
}



