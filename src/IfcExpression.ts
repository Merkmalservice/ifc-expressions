import {
  CharStream,
  CommonTokenStream,
  ErrorListener,
  ParserRuleContext,
  ParseTreeWalker,
  Token,
} from "antlr4";
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
import IfcExpressionParser from "./gen/parser/IfcExpressionParser.js";
import IfcExpressionVisitor from "./gen/parser/IfcExpressionVisitor.js";
import IfcExpressionLexer from "./gen/parser/IfcExpressionLexer.js";
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
};

export type { BoxedValueTypes };

export class IfcExpressionParseResult {
  private readonly _input: string;
  private readonly _typeManager: TypeManager;
  private readonly _parseTree: ParserRuleContext;

  constructor(input: string, typeManager: TypeManager, exprContext) {
    this._typeManager = typeManager;
    this._parseTree = exprContext;
    this._input = input;
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
}

export class IfcExpression {
  /**
   * Parses the input and returns a parse result, which contains the parse tree, the type information per parse tree node, and the input.
   * @param input
   * @param errorListener
   * @return the parse result, which can subequently be compiled into an Expr using compile().
   */
  public static parse(
    input: string,
    errorListener?: ErrorListener<Token | number>
  ): IfcExpressionParseResult {
    const chars = new CharStream(input); // replace this with a FileStream as required
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
    const validationListener = new IfcExpressionValidationListener();
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
      expr
    );
  }

  /**
   * Compiles the specified parseResult into an Expr.
   * @param parseResult
   * @return the Expression (Expr), which can be evaluated to obtain its result.
   */
  public static compile(
    parseResult: IfcExpressionParseResult
  ): Expr<ExpressionValue> {
    const compiler = new ExprCompiler(parseResult.typeManager);
    const expr = compiler.visit(parseResult.parseTree);
    ExprToTextInputLinker.linkTextToExpressions(
      parseResult.input,
      expr,
      compiler.getExprManager()
    );
    return expr;
  }

  /**
   * Evaluates the specified input expression and returns the evaluation result. The parse
   * and compile steps are done internally.
   *
   * @param expression: the input expression
   * @param context: the context required for accessing the IFC model
   * @return the result (or an error object).
   */
  public static evaluate(
    expression: string,
    context: IfcExpressionContext = new NopContext()
  ): ExprEvalResult<ExpressionValue> {
    const errorListener = new IfcExpressionErrorListener();
    const parseResult = IfcExpression.parse(expression, errorListener);
    if (errorListener.isErrorOccurred()) {
      return mapException(errorListener.getException());
    }
    const compiledExpression = this.compile(parseResult);
    return compiledExpression.evaluate(context, new Map<string, any>());
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
    expr: Expr<ExpressionValue>,
    context: IfcExpressionContext = new NopContext()
  ) {
    if (isNullish(expr.getTextSpan())) {
      // if the expr was created by parsing an input, it has a textSpan set.
      // If the expr was created programmatically, we have to generate its exprString once, which causes its
      // textspan to be set.
      // make sure we know the position
      expr.toExprString();
    }
    return expr.evaluate(context, new Map());
  }
}
