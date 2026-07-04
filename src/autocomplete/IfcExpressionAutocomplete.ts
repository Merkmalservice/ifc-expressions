import {
  CharStream,
  CommonTokenStream,
  ParserRuleContext,
  Token,
} from "antlr4ng";
import {
  CandidatesCollection,
  CodeCompletionCore,
  ICandidateRule,
} from "antlr4-c3";
import {
  BuiltinFunctionDefinition,
  BuiltinMemberDefinition,
  BuiltinVariableRegistry,
} from "../builtin/BuiltinVariableRegistry.js";
import { IfcExpressionLexer } from "../gen/parser/IfcExpressionLexer.js";
import {
  ExprListContext,
  FunctionCallContext,
  IfcExpressionParser,
  MethodAccessorContext,
  MethodCallChainContext,
  MethodCallChainEndContext,
  MethodCallChainInnerContext,
  MethodFunctionCallContext,
  MethodPropertyAccessContext,
  SEMethodCallContext,
  SEParenthesisContext,
  SEVariableRefContext,
  SingleExprContext,
} from "../gen/parser/IfcExpressionParser.js";
import { IfcExpressionFunctions } from "../expression/function/IfcExpressionFunctions.js";
import { ContextObjectType } from "../type/ContextObjectType.js";
import { ExprType } from "../type/ExprType.js";
import { CompletionItem, CompletionResult } from "./CompletionItem.js";
import {
  DocumentationLocalizer,
  resolveLocalizedText,
} from "../documentation/Documentation.js";

export type IfcExpressionAutocompleteOptions = {
  builtinVariableRegistry?: BuiltinVariableRegistry;
  localizer?: DocumentationLocalizer;
};

type CompletedAccessorStep =
  | {
      name: string;
      kind: "property";
      startTokenIndex: number;
    }
  | {
      name: string;
      kind: "function";
      argumentCount: number;
      startTokenIndex: number;
    };

type MethodAccessorStep =
  | CompletedAccessorStep
  | {
      kind: "incomplete";
      startTokenIndex: number;
    };

type ParsedAutocompleteInput = {
  parser: IfcExpressionParser;
  parseTree: ParserRuleContext;
  tokens: Array<Token>;
  caretTokenIndex: number;
};

function isIdentifierChar(char: string | undefined): boolean {
  return typeof char === "string" && /[a-zA-Z0-9_\-$&]/.test(char);
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

const unsupportedPrimitiveMethodFunctionNames = new Set([
  "NAME",
  "GUID",
  "IFCCLASS",
  "DESCRIPTION",
  "VALUE",
]);

const preferredMethodLabels = new Map<string, string>([
  ["MAP", "map"],
  ["CHOOSE", "choose"],
  ["AT", "at"],
  ["IF", "if"],
  ["ROUND", "round"],
  ["NAME", "name"],
  ["GUID", "guid"],
  ["IFCCLASS", "ifcClass"],
  ["DESCRIPTION", "description"],
  ["VALUE", "value"],
  ["PROPERTYSET", "propertySet"],
  ["PROPERTY", "property"],
  ["TYPE", "type"],
  ["NOT", "not"],
  ["TOSTRING", "toString"],
  ["TONUMERIC", "toNumeric"],
  ["TONUMBER", "toNumber"],
  ["TOBOOLEAN", "toBoolean"],
  ["TOLOGICAL", "toLogical"],
  ["NOTFOUNDASUNKNOWN", "notFoundAsUnknown"],
  ["TOIFCDATE", "toIfcDate"],
  ["TOIFCTIME", "toIfcTime"],
  ["TOIFCDATETIME", "toIfcDateTime"],
  ["TOIFCDURATION", "toIfcDuration"],
  ["TOIFCTIMESTAMP", "toIfcTimeStamp"],
  ["ADDDURATION", "addDuration"],
  ["TOLOWERCASE", "toLowerCase"],
  ["TOUPPERCASE", "toUpperCase"],
  ["SUBSTRING", "substring"],
  ["SPLIT", "split"],
  ["EXISTS", "exists"],
  ["AND", "and"],
  ["OR", "or"],
  ["XOR", "xor"],
  ["IMPLIES", "implies"],
  ["EQUALS", "equals"],
  ["GREATERTHAN", "greaterThan"],
  ["GREATERTHANOREQUAL", "greaterThanOrEqual"],
  ["LESSTHAN", "lessThan"],
  ["LESSTHANOREQUAL", "lessThanOrEqual"],
  ["CONTAINS", "contains"],
  ["MATCHES", "matches"],
  ["REGEXCONTAINS", "regexContains"],
  ["REGEXMATCHES", "regexMatches"],
  ["REPLACE", "replace"],
  ["REGEXREPLACE", "regexReplace"],
]);

function isExtendableTokenType(tokenType: number): boolean {
  return tokenType === IfcExpressionParser.IDENTIFIER;
}

function findCaretTokenIndex(
  tokens: Array<Token>,
  cursorOffset: number
): number {
  if (tokens.length === 0) {
    return 0;
  }

  const cursor = Math.max(0, cursorOffset);
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === Token.EOF) {
      return token.tokenIndex;
    }

    if (cursor < token.start) {
      return token.tokenIndex;
    }

    if (cursor <= token.stop) {
      return token.tokenIndex;
    }

    if (cursor === token.stop + 1) {
      if (isExtendableTokenType(token.type)) {
        return token.tokenIndex;
      }

      const nextToken = tokens[i + 1];
      return nextToken?.tokenIndex ?? token.tokenIndex;
    }
  }

  return tokens[tokens.length - 1].tokenIndex;
}

function parseAutocompleteInput(
  input: string,
  cursorOffset: number
): ParsedAutocompleteInput {
  const chars = CharStream.fromString(input);
  const lexer = new IfcExpressionLexer(chars);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new IfcExpressionParser(tokenStream);
  lexer.removeErrorListeners();
  parser.removeErrorListeners();
  const parseTree = parser.expr();
  tokenStream.fill();
  const tokens = tokenStream.getTokens();

  return {
    parser,
    parseTree,
    tokens,
    caretTokenIndex: findCaretTokenIndex(tokens, cursorOffset),
  };
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

function findIdentifierReplaceRange(
  input: string,
  cursorOffset: number
): { from: number; to: number } {
  const cursor = Math.max(0, Math.min(cursorOffset, input.length));
  let from = cursor;

  while (from > 0 && isIdentifierChar(input[from - 1])) {
    from--;
  }

  return {
    from,
    to: cursor,
  };
}

function findMemberReplaceRange(
  input: string,
  cursorOffset: number
): { from: number; to: number } | undefined {
  const range = findIdentifierReplaceRange(input, cursorOffset);

  if (range.from === 0 || input[range.from - 1] !== ".") {
    return undefined;
  }

  return range;
}

function findFunctionReplaceRange(
  input: string,
  cursorOffset: number
): { from: number; to: number } | undefined {
  const range = findIdentifierReplaceRange(input, cursorOffset);
  const prefixChar = range.from > 0 ? input[range.from - 1] : undefined;
  const hasIdentifierFragment =
    range.from < range.to || isIdentifierChar(input[Math.max(0, range.to)]);

  if (!hasIdentifierFragment || prefixChar === "." || prefixChar === "$") {
    return undefined;
  }

  return range;
}

function countExprListArguments(exprList: ExprListContext | undefined): number {
  if (!exprList) {
    return 0;
  }

  const rest = exprList.exprList();
  return 1 + (rest ? countExprListArguments(rest) : 0);
}

function toMethodAccessorStep(
  methodAccessor: MethodAccessorContext
): CompletedAccessorStep | undefined {
  if (methodAccessor instanceof MethodPropertyAccessContext) {
    const identifier = methodAccessor.IDENTIFIER()?.getText();
    if (!identifier) {
      return undefined;
    }

    return {
      name: identifier,
      kind: "property",
      startTokenIndex: methodAccessor.start?.tokenIndex ?? -1,
    };
  }

  if (methodAccessor instanceof MethodFunctionCallContext) {
    const functionCall = methodAccessor.functionCall();
    const name = functionCall.IDENTIFIER()?.getText();
    if (!name) {
      return undefined;
    }

    return {
      name,
      kind: "function",
      argumentCount: countExprListArguments(functionCall.exprList()),
      startTokenIndex: functionCall.start?.tokenIndex ?? -1,
    };
  }

  return undefined;
}

function collectMethodCallChainSteps(
  methodCallChain: MethodCallChainContext
): Array<MethodAccessorStep> | undefined {
  if (methodCallChain instanceof MethodCallChainInnerContext) {
    const current = toMethodAccessorStep(methodCallChain.methodAccessor());
    const rest = collectMethodCallChainSteps(methodCallChain.methodCallChain());
    if (!current || !rest) {
      return undefined;
    }

    return [current, ...rest];
  }

  if (methodCallChain instanceof MethodCallChainEndContext) {
    const current = toMethodAccessorStep(methodCallChain.methodAccessor());
    return current ? [current] : undefined;
  }

  const dot = methodCallChain.getToken(IfcExpressionParser.DOT, 0);
  if (dot) {
    return [
      {
        kind: "incomplete",
        startTokenIndex: dot.symbol.tokenIndex + 1,
      },
    ];
  }

  return [];
}

function getMemberResultType(definition: BuiltinMemberDefinition): ExprType {
  return definition.kind === "property"
    ? definition.valueType
    : definition.returnType;
}

function resolveCompletedAccessorStep(
  currentType: ExprType,
  step: CompletedAccessorStep
): ExprType | undefined {
  if (!(currentType instanceof ContextObjectType)) {
    return undefined;
  }

  const memberDefinition = currentType.getMemberDefinition(step.name);
  if (!memberDefinition) {
    return undefined;
  }

  if (step.kind === "property") {
    return memberDefinition.kind === "property"
      ? memberDefinition.valueType
      : undefined;
  }

  if (memberDefinition.kind !== "function") {
    return undefined;
  }

  if (memberDefinition.argumentTypes.length !== step.argumentCount) {
    return undefined;
  }

  return memberDefinition.returnType;
}

function resolveSingleExprType(
  singleExpr: SingleExprContext,
  builtinVariableRegistry: BuiltinVariableRegistry
): ExprType | undefined {
  if (singleExpr instanceof SEVariableRefContext) {
    const identifier = singleExpr.variableRef()?.IDENTIFIER()?.getText();
    return identifier
      ? builtinVariableRegistry.getDefinition(`$${identifier}`)?.type
      : undefined;
  }

  if (singleExpr instanceof SEParenthesisContext) {
    return resolveSingleExprType(
      singleExpr.singleExpr(),
      builtinVariableRegistry
    );
  }

  if (singleExpr instanceof SEMethodCallContext) {
    const baseType = resolveSingleExprType(
      singleExpr.singleExpr(),
      builtinVariableRegistry
    );
    const steps = collectMethodCallChainSteps(singleExpr.methodCallChain());
    if (!baseType || !steps) {
      return undefined;
    }

    let currentType: ExprType | undefined = baseType;
    for (const step of steps) {
      if (step.kind === "incomplete") {
        return undefined;
      }

      currentType = resolveCompletedAccessorStep(currentType, step);
      if (!currentType) {
        return undefined;
      }
    }

    return currentType;
  }

  return undefined;
}

function findReceiverTypeForMemberSlot(
  node: ParserRuleContext,
  startTokenIndex: number,
  builtinVariableRegistry: BuiltinVariableRegistry
): ExprType | undefined {
  if (node instanceof SEMethodCallContext) {
    const steps = collectMethodCallChainSteps(node.methodCallChain());
    if (steps) {
      const slotIndex = steps.findIndex(
        (step) => step.startTokenIndex === startTokenIndex
      );

      if (slotIndex >= 0) {
        let currentType = resolveSingleExprType(
          node.singleExpr(),
          builtinVariableRegistry
        );

        for (const step of steps.slice(0, slotIndex)) {
          if (!currentType || step.kind === "incomplete") {
            return undefined;
          }

          currentType = resolveCompletedAccessorStep(currentType, step);
        }

        return currentType;
      }
    }
  }

  for (let i = 0; i < node.getChildCount(); i++) {
    const child = node.getChild(i);
    if (child instanceof ParserRuleContext) {
      const receiverType = findReceiverTypeForMemberSlot(
        child,
        startTokenIndex,
        builtinVariableRegistry
      );
      if (receiverType) {
        return receiverType;
      }
    }
  }

  return undefined;
}

function toFunctionInsertText(name: string): string {
  return `${name}()`;
}

function buildSignatureLabel(
  name: string,
  argumentLabels: Array<string>
): string {
  return `${name}(${argumentLabels.join(", ")})`;
}

function buildFunctionDocumentation(
  name: string,
  localizer?: DocumentationLocalizer,
  displayName = name
): string | undefined {
  const func = IfcExpressionFunctions.getFunction(name);
  const documentation = func?.getDocumentation();
  if (!func || !documentation) {
    return undefined;
  }

  const fallback = `${func.getSignatureLabel(displayName)}: ${documentation.fallback}`;
  return localizer ? localizer.t(documentation.key, fallback) : fallback;
}

function buildMemberDocumentation(
  definition: BuiltinMemberDefinition,
  localizer?: DocumentationLocalizer
): string | undefined {
  if (!definition.documentation) {
    return undefined;
  }

  const fallback =
    definition.kind === "property"
      ? `${definition.name}: ${definition.documentation.fallback}`
      : `${buildSignatureLabel(
          definition.name,
          (definition.argumentDocumentation ?? []).map(
            (argument, index) => argument.label.fallback ?? `arg${index}`
          )
        )}: ${definition.documentation.fallback}`;

  return localizer
    ? localizer.t(definition.documentation.key, fallback)
    : fallback;
}

function buildRootDocumentation(
  name: string,
  documentation,
  localizer?: DocumentationLocalizer
): string | undefined {
  if (!documentation) {
    return undefined;
  }

  const fallback = documentation.fallback;
  return localizer ? localizer.t(documentation.key, fallback) : fallback;
}

type CallFrame = {
  kind: "function" | "group" | "array";
  name?: string;
  argumentIndex: number;
  startTokenIndex?: number;
};

function findActiveCallFrame(
  tokens: Array<Token>,
  cursorOffset: number
): CallFrame | undefined {
  const stack: Array<CallFrame> = [];
  let previousSignificantToken: Token | undefined;

  for (const token of tokens) {
    if (token.type === Token.EOF || token.start >= cursorOffset) {
      break;
    }

    if (
      token.type === IfcExpressionParser.WS ||
      token.type === IfcExpressionParser.NEWLINE
    ) {
      continue;
    }

    if (token.type === IfcExpressionParser.T__1) {
      stack.push(
        previousSignificantToken?.type === IfcExpressionParser.IDENTIFIER
          ? {
              kind: "function",
              name: previousSignificantToken.text ?? undefined,
              argumentIndex: 0,
              startTokenIndex: previousSignificantToken.tokenIndex,
            }
          : { kind: "group", argumentIndex: 0 }
      );
    } else if (token.type === IfcExpressionParser.T__10) {
      stack.push({ kind: "array", argumentIndex: 0 });
    } else if (
      token.type === IfcExpressionParser.T__2 ||
      token.type === IfcExpressionParser.T__11
    ) {
      stack.pop();
    } else if (token.type === IfcExpressionParser.T__9) {
      const currentFrame = stack[stack.length - 1];
      if (currentFrame?.kind === "function") {
        currentFrame.argumentIndex += 1;
      }
    }

    previousSignificantToken = token;
  }

  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i].kind === "function") {
      return stack[i];
    }
  }

  return undefined;
}

function buildMemberSignatureLabel(
  definition: BuiltinFunctionDefinition
): string {
  return buildSignatureLabel(
    definition.name,
    (definition.argumentDocumentation ?? []).map(
      (argument, index) => argument.label.fallback ?? `arg${index}`
    )
  );
}

function buildActiveMemberHelp(
  parseTree: ParserRuleContext,
  builtinVariableRegistry: BuiltinVariableRegistry,
  activeFrame: CallFrame,
  localizer?: DocumentationLocalizer
): CompletionResult["activeHelp"] {
  if (activeFrame.startTokenIndex === undefined || !activeFrame.name) {
    return undefined;
  }

  const receiverType = findReceiverTypeForMemberSlot(
    parseTree,
    activeFrame.startTokenIndex,
    builtinVariableRegistry
  );
  if (!(receiverType instanceof ContextObjectType)) {
    return undefined;
  }

  const memberDefinition = receiverType.getMemberDefinition(activeFrame.name);
  if (
    memberDefinition?.kind !== "function" ||
    !memberDefinition.documentation
  ) {
    return undefined;
  }

  const label = buildMemberSignatureLabel(memberDefinition);
  const fallback = memberDefinition.documentation.fallback.startsWith(
    `${label}: `
  )
    ? memberDefinition.documentation.fallback
    : `${label}: ${memberDefinition.documentation.fallback}`;
  const activeArgument =
    memberDefinition.argumentDocumentation?.[activeFrame.argumentIndex];

  return {
    label,
    documentation: localizer
      ? localizer.t(memberDefinition.documentation.key, fallback)
      : fallback,
    activeParameterIndex: activeFrame.argumentIndex,
    activeParameterLabel: activeArgument
      ? resolveLocalizedText(activeArgument.label, localizer) ??
        activeArgument.label.fallback
      : undefined,
    activeParameterDocumentation: activeArgument
      ? resolveLocalizedText(activeArgument.documentation, localizer)
      : undefined,
  };
}

function buildActiveHelp(
  parseTree: ParserRuleContext,
  builtinVariableRegistry: BuiltinVariableRegistry,
  tokens: Array<Token>,
  cursorOffset: number,
  localizer?: DocumentationLocalizer
): CompletionResult["activeHelp"] {
  const activeFrame = findActiveCallFrame(tokens, cursorOffset);
  if (!activeFrame?.name) {
    return undefined;
  }

  const memberHelp = buildActiveMemberHelp(
    parseTree,
    builtinVariableRegistry,
    activeFrame,
    localizer
  );
  if (memberHelp) {
    return memberHelp;
  }

  const func = IfcExpressionFunctions.getFunction(activeFrame.name);
  const documentation = func?.getDocumentation();
  if (!func || !documentation) {
    return undefined;
  }

  const activeArgument = func.getFormalArguments()[activeFrame.argumentIndex];
  const label = func.getSignatureLabel(activeFrame.name);
  const fallback = `${label}: ${documentation.fallback}`;
  return {
    label,
    documentation: localizer
      ? localizer.t(documentation.key, fallback)
      : fallback,
    activeParameterIndex: activeFrame.argumentIndex,
    activeParameterLabel: activeArgument
      ? resolveLocalizedText(activeArgument.displayLabel, localizer) ??
        activeArgument.displayLabel?.fallback ??
        activeArgument.name
      : undefined,
    activeParameterDocumentation: activeArgument
      ? resolveLocalizedText(activeArgument.documentation, localizer)
      : undefined,
  };
}
function toFunctionItem(
  name: string,
  localizer?: DocumentationLocalizer,
  label = name
): CompletionItem {
  const insertText = toFunctionInsertText(label);

  return {
    kind: "builtinFunction",
    label,
    insertText,
    cursorOffset: insertText.length - 1,
    documentation: buildFunctionDocumentation(name, localizer, label),
  };
}

function getPreferredMethodLabel(name: string): string {
  return preferredMethodLabels.get(name) ?? name;
}

function isApplicablePrimitiveMethodFunction(
  name: string,
  receiverType: ExprType
): boolean {
  if (unsupportedPrimitiveMethodFunctionNames.has(name)) {
    return false;
  }

  const func = IfcExpressionFunctions.getFunction(name);
  const firstArgument = func?.getFormalArguments()[0];
  if (!func || !firstArgument) {
    return false;
  }

  const firstArgumentType = firstArgument.getType();
  return (
    firstArgumentType.isAssignableFrom(receiverType) ||
    firstArgumentType.overlapsWith(receiverType)
  );
}

function getPrimitiveMethodItems(
  receiverType: ExprType,
  localizer?: DocumentationLocalizer
): Array<CompletionItem> {
  return IfcExpressionFunctions.getBuiltinFunctionNames()
    .filter((name) => isApplicablePrimitiveMethodFunction(name, receiverType))
    .map((name) => toFunctionItem(name, localizer, getPreferredMethodLabel(name)));
}

function toMemberItem(
  definition: BuiltinMemberDefinition,
  localizer?: DocumentationLocalizer
): CompletionItem {
  if (definition.kind === "property") {
    return {
      kind: "builtinMemberProperty",
      label: definition.name,
      returnTypeName: toCompletionTypeName(definition.valueType),
      chainable: isChainableType(definition.valueType),
      documentation: buildMemberDocumentation(definition, localizer),
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
    documentation: buildMemberDocumentation(definition, localizer),
  };
}

function collectRuleCandidates(
  parser: IfcExpressionParser,
  caretTokenIndex: number,
  parseTree: ParserRuleContext
): CandidatesCollection {
  const completionCore = new CodeCompletionCore(parser);
  completionCore.preferredRules = new Set([
    IfcExpressionParser.RULE_variableRef,
    IfcExpressionParser.RULE_methodAccessor,
  ]);

  return completionCore.collectCandidates(caretTokenIndex, parseTree);
}

function getMemberRuleCandidate(
  ruleCandidates: Map<number, ICandidateRule>
): ICandidateRule | undefined {
  return ruleCandidates.get(IfcExpressionParser.RULE_methodAccessor);
}

function hasBuiltinRootRuleCandidate(
  ruleCandidates: Map<number, ICandidateRule>
): boolean {
  return ruleCandidates.has(IfcExpressionParser.RULE_variableRef);
}

function hasIdentifierTokenCandidate(
  tokenCandidates: Map<number, Array<number>>
): boolean {
  return tokenCandidates.has(IfcExpressionParser.IDENTIFIER);
}

export class IfcExpressionAutocomplete {
  public static complete(
    input: string,
    cursorOffset: number,
    options: IfcExpressionAutocompleteOptions = {}
  ): CompletionResult {
    const builtinVariableRegistry =
      options.builtinVariableRegistry ??
      BuiltinVariableRegistry.getDefaultRegistry();
    const parsed = parseAutocompleteInput(input, cursorOffset);
    const candidates = collectRuleCandidates(
      parsed.parser,
      parsed.caretTokenIndex,
      parsed.parseTree
    );
    const ruleCandidates = candidates.rules;
    const activeHelp = buildActiveHelp(
      parsed.parseTree,
      builtinVariableRegistry,
      parsed.tokens,
      cursorOffset,
      options.localizer
    );

    const memberCandidate = getMemberRuleCandidate(ruleCandidates);
    if (memberCandidate) {
      const range = findMemberReplaceRange(input, cursorOffset);
      if (!range) {
        return {
          items: [],
          replaceFrom: cursorOffset,
          replaceTo: cursorOffset,
          activeHelp,
        };
      }

      const receiverType = findReceiverTypeForMemberSlot(
        parsed.parseTree,
        memberCandidate.startTokenIndex,
        builtinVariableRegistry
      );
      const typedPrefix = normalizeForMatch(input.slice(range.from, range.to));
      const items = (
        receiverType instanceof ContextObjectType
          ? receiverType
              .getMemberDefinitions()
              .map((definition) => toMemberItem(definition, options.localizer))
          : receiverType
          ? getPrimitiveMethodItems(receiverType, options.localizer)
          : []
      )
        .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
        .sort((left, right) => left.label.localeCompare(right.label));

      return {
        items,
        replaceFrom: range.from,
        replaceTo: range.to,
        activeHelp,
      };
    }

    const functionRange = findFunctionReplaceRange(input, cursorOffset);
    if (functionRange && hasIdentifierTokenCandidate(candidates.tokens)) {
      const typedPrefix = normalizeForMatch(
        input.slice(functionRange.from, functionRange.to)
      );
      const items = IfcExpressionFunctions.getBuiltinFunctionNames()
        .map((name) => toFunctionItem(name, options.localizer))
        .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
        .sort((left, right) => left.label.localeCompare(right.label));

      if (items.length > 0) {
        return {
          items,
          replaceFrom: functionRange.from,
          replaceTo: functionRange.to,
          activeHelp,
        };
      }
    }

    const range = findBuiltinRootReplaceRange(input, cursorOffset);
    if (!range || !hasBuiltinRootRuleCandidate(ruleCandidates)) {
      return {
        items: [],
        replaceFrom: cursorOffset,
        replaceTo: cursorOffset,
        activeHelp,
      };
    }

    const typedPrefix = normalizeForMatch(input.slice(range.from, range.to));
    const items: Array<CompletionItem> = builtinVariableRegistry
      .getDefinitions()
      .map((definition) => ({
        kind: "builtinRoot" as const,
        label: toBuiltinLabel(definition.name),
        documentation: buildRootDocumentation(
          definition.name,
          definition.documentation,
          options.localizer
        ),
      }))
      .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
      .sort((left, right) => left.label.localeCompare(right.label));

    return {
      items,
      replaceFrom: range.from,
      replaceTo: range.to,
      activeHelp,
    };
  }
}
