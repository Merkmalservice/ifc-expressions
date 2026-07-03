import {
  ANTLRErrorListener,
  CharStream,
  CommonTokenStream,
  ParserRuleContext,
  ParseTreeWalker,
  Token,
} from "antlr4ng";
import { ExprCompiler } from "./compiler/ExprCompiler.js";
import { IfcExpressionErrorListener } from "./IfcExpressionErrorListener.js";
import { IfcExpressionValidationListener } from "./compiler/IfcExpressionValidationListener.js";

import { isNullish, isPresent } from "./util/IfcExpressionUtils.js";
import { IfcExpressionContext } from "./context/IfcExpressionContext.js";
import { Expr } from "./expression/Expr.js";

import { IfcElementAccessor } from "./context/IfcElementAccessor.js";
import { Value } from "./value/Value.js";
import { StringValue } from "./value/StringValue.js";
import { NumericValue } from "./value/NumericValue.js";
import { BooleanValue } from "./value/BooleanValue.js";
import { LogicalValue } from "./value/LogicalValue.js";
import { ReferenceValue } from "./value/ReferenceValue.js";
import { IfcPropertySetAccessor } from "./context/IfcPropertySetAccessor.js";
import { IfcPropertyAccessor } from "./context/IfcPropertyAccessor.js";
import { IfcRootObjectAccessor } from "./context/IfcRootObjectAccessor.js";
import { IfcTypeObjectAccessor } from "./context/IfcTypeObjectAccessor.js";
import { NamedObjectAccessor } from "./context/NamedObjectAccessor.js";
import { IfcExpressionParser } from "./gen/parser/IfcExpressionParser.js";
import { IfcExpressionVisitor } from "./gen/parser/IfcExpressionVisitor.js";
import { IfcExpressionLexer } from "./gen/parser/IfcExpressionLexer.js";
import { ObjectAccessor } from "./context/ObjectAccessor.js";
import { IfcExpressionEvaluationException } from "./expression/IfcExpressionEvaluationException.js";
import type { ExpressionValue } from "./value/ExpressionValue.js";
import type { BoxedValueTypes } from "./value/BoxedValueTypes.js";
import {
  ExprEvalError,
  ExprEvalResult,
  isExprEvalError,
  isExprEvalSuccess,
} from "./expression/ExprEvalResult.js";
import { ExprKind } from "./expression/ExprKind.js";
import { ValidationException } from "./error/ValidationException.js";
import { TypeManager } from "./compiler/TypeManager.js";
import { mapException } from "./error/ExceptionToExprEvalErrorMapper.js";
import { NopContext } from "./context/NopContext.js";
import { ExprToTextInputLinker } from "./compiler/ExprToTextInputLinker.js";
import { TextSpan } from "./util/TextSpan.js";
import { ExprFacade } from "./expression/ExprFacade.js";
import { IfcDurationValue } from "./value/IfcDurationValue";
import { IfcDateValue } from "./value/IfcDateValue.js";
import { IfcDateTimeValue } from "./value/IfcDateTimeValue.js";
import { IfcTimeValue } from "./value/IfcTimeValue.js";
import { IfcTimeStampValue } from "./value/IfcTimeStampValue.js";
import { ArrayType } from "./type/ArrayType.js";
import { ExprType } from "./type/ExprType.js";
import { SimpleType } from "./type/SimpleType.js";
import { TupleType } from "./type/TupleType.js";
import { TypeDisjunction } from "./type/TypeDisjunction.js";
import { Types } from "./type/Types.js";
import { ContextObjectType } from "./type/ContextObjectType.js";
import { BuiltinVariableRegistry } from "./builtin/BuiltinVariableRegistry.js";
import { IfcExpressionOptions } from "./IfcExpressionOptions.js";
import { IfcExpressionAutocomplete } from "./autocomplete/IfcExpressionAutocomplete.js";
import type {
  CompletionItem,
  CompletionResult,
} from "./autocomplete/CompletionItem.js";
import type { IfcExpressionAutocompleteOptions } from "./autocomplete/IfcExpressionAutocomplete.js";

export {
  IfcElementAccessor,
  IfcExpressionContext,
  Value,
  StringValue,
  BooleanValue,
  LogicalValue,
  NumericValue,
  ExpressionValue,
  ReferenceValue,
  IfcDateValue,
  IfcDateTimeValue,
  IfcTimeValue,
  IfcDurationValue,
  IfcTimeStampValue,
  IfcPropertySetAccessor,
  IfcPropertyAccessor,
  IfcRootObjectAccessor,
  IfcTypeObjectAccessor,
  NamedObjectAccessor,
  ObjectAccessor,
  Expr,
  ExprCompiler,
  ExprKind,
  IfcExpressionEvaluationException,
  IfcExpressionErrorListener,
  IfcExpressionVisitor,
  isPresent,
  isNullish,
  ExprEvalResult,
  ExprEvalError,
  isExprEvalError,
  isExprEvalSuccess,
  ExprToTextInputLinker,
  ExprFacade,
  ArrayType,
  ExprType,
  SimpleType,
  TupleType,
  TypeDisjunction,
  Types,
  ContextObjectType,
  BuiltinVariableRegistry,
  IfcExpressionAutocomplete,
};

export type {
  BoxedValueTypes,
  IfcExpressionOptions,
  CompletionItem,
  CompletionResult,
  IfcExpressionAutocompleteOptions,
};

export class IfcExpressionParseResult {
  private readonly _input: string;
  private readonly _typeManager: TypeManager;
  private readonly _parseTree: ParserRuleContext;
  private readonly _builtinVariableRegistry: BuiltinVariableRegistry;

  constructor(
    input: string,
    typeManager: TypeManager,
    exprContext,
    builtinVariableRegistry: BuiltinVariableRegistry
  ) {
    this._typeManager = typeManager;
    this._parseTree = exprContext;
    this._input = input;
    this._builtinVariableRegistry = builtinVariableRegistry;
  }

  get typeManager(): TypeManager {
    return this._typeManager;
  }

  get parseTree(): ParserRuleContext {
    return this._parseTree;
  }

  get input(): string {
    return this._input;
  }

  get builtinVariableRegistry(): BuiltinVariableRegistry {
    return this._builtinVariableRegistry;
  }
}

export class IfcExpression {
  public static parse(
    input: string,
    errorListener?: ANTLRErrorListener,
    options: IfcExpressionOptions = {}
  ): IfcExpressionParseResult {
    const builtinVariableRegistry =
      options.builtinVariableRegistry ??
      BuiltinVariableRegistry.getDefaultRegistry();
    const chars = CharStream.fromString(input);
    const lexer = new IfcExpressionLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new IfcExpressionParser(tokens);
    lexer.removeErrorListeners();
    parser.removeErrorListeners();
    const myErrorListener = new IfcExpressionErrorListener();
    if (isPresent(errorListener)) {
      lexer.addErrorListener(errorListener);
      parser.addErrorListener(errorListener);
    }
    lexer.addErrorListener(myErrorListener);
    parser.addErrorListener(myErrorListener);
    let expr;
    expr = parser.expr();
    const validationListener = new IfcExpressionValidationListener(
      builtinVariableRegistry
    );
    if (!myErrorListener.isErrorOccurred()) {
      const walker = new ParseTreeWalker();
      try {
        walker.walk(validationListener, expr);
      } catch (e) {
        if (e instanceof ValidationException) {
          if (errorListener instanceof IfcExpressionErrorListener) {
            errorListener.validationException(e);
          }
          myErrorListener.validationException(e);
        }
      }
    }
    return new IfcExpressionParseResult(
      input,
      validationListener.getTypeManager(),
      expr,
      builtinVariableRegistry
    );
  }

  public static compile(
    parseResult: IfcExpressionParseResult
  ): ExprFacade<ExpressionValue> {
    const compiler = new ExprCompiler(
      parseResult.typeManager,
      parseResult.builtinVariableRegistry
    );
    const expr = compiler.visit(parseResult.parseTree);
    ExprToTextInputLinker.linkTextToExpressions(
      parseResult.input,
      expr,
      compiler.getExprManager()
    );
    return new ExprFacade(expr);
  }

  public static evaluate(
    expression: string,
    context: IfcExpressionContext = new NopContext(),
    options: IfcExpressionOptions = {}
  ): ExprEvalResult<ExpressionValue> {
    const errorListener = new IfcExpressionErrorListener();
    const parseResult = IfcExpression.parse(expression, errorListener, options);
    if (errorListener.isErrorOccurred()) {
      return mapException(errorListener.getException());
    }
    const compiledExpression = this.compile(parseResult);
    return compiledExpression.evaluate(context);
  }

  public static formatError(input: string, error: ExprEvalError) {
    const lines = ["** Error **"];
    if (!isNullish(error["textSpan"])) {
      const span: TextSpan = error["textSpan"];
      const underlined = span.underline(input, "^");
      const startString = "Input: ";
      const indented = this.indent(underlined, startString.length);
      const replaced = startString + indented.substr(startString.length);
      replaced.split("\n").forEach((line) => lines.push(line));
    }
    lines.push("Problem: " + error.message);
    return lines.join("\n");
  }

  private static indent(s: string, by: number) {
    return s
      .split("\n")
      .map((line) => " ".repeat(by) + line)
      .join("\n");
  }

  public static evaluateExpression(
    expr: ExprFacade<ExpressionValue>,
    context: IfcExpressionContext = new NopContext()
  ) {
    return expr.evaluate(context);
  }
}
