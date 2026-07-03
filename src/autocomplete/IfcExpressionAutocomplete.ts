import {
  CharStream,
  CommonTokenStream,
  ParserRuleContext,
  Token,
} from "antlr4ng";
import { CandidatesCollection, CodeCompletionCore, ICandidateRule } from "antlr4-c3";
import {
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

export type IfcExpressionAutocompleteOptions = {
  builtinVariableRegistry?: BuiltinVariableRegistry;
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

function toFunctionItem(name: string): CompletionItem {
  const insertText = toFunctionInsertText(name);

  return {
    kind: "builtinFunction",
    label: name,
    insertText,
    cursorOffset: insertText.length - 1,
  };
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

    const memberCandidate = getMemberRuleCandidate(ruleCandidates);
    if (memberCandidate) {
      const range = findMemberReplaceRange(input, cursorOffset);
      if (!range) {
        return {
          items: [],
          replaceFrom: cursorOffset,
          replaceTo: cursorOffset,
        };
      }

      const receiverType = findReceiverTypeForMemberSlot(
        parsed.parseTree,
        memberCandidate.startTokenIndex,
        builtinVariableRegistry
      );
      if (!(receiverType instanceof ContextObjectType)) {
        return {
          items: [],
          replaceFrom: range.from,
          replaceTo: range.to,
        };
      }

      const typedPrefix = normalizeForMatch(input.slice(range.from, range.to));
      const items = receiverType
        .getMemberDefinitions()
        .map(toMemberItem)
        .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
        .sort((left, right) => left.label.localeCompare(right.label));

      return {
        items,
        replaceFrom: range.from,
        replaceTo: range.to,
      };
    }

    const functionRange = findFunctionReplaceRange(input, cursorOffset);
    if (functionRange && hasIdentifierTokenCandidate(candidates.tokens)) {
      const typedPrefix = normalizeForMatch(
        input.slice(functionRange.from, functionRange.to)
      );
      const items = IfcExpressionFunctions.getBuiltinFunctionNames()
        .map(toFunctionItem)
        .filter((item) => normalizeForMatch(item.label).startsWith(typedPrefix))
        .sort((left, right) => left.label.localeCompare(right.label));

      if (items.length > 0) {
        return {
          items,
          replaceFrom: functionRange.from,
          replaceTo: functionRange.to,
        };
      }
    }

    const range = findBuiltinRootReplaceRange(input, cursorOffset);
    if (!range || !hasBuiltinRootRuleCandidate(ruleCandidates)) {
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




