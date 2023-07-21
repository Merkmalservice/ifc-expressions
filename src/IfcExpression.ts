import {CharStream, CommonTokenStream, ErrorListener, Token} from "antlr4";
import {ExprVisitor} from "./ExprVisitor.js";
import {IfcExpressionErrorListener} from "./IfcExpressionErrorListener.js";
import {isNullish, isPresent} from "./IfcExpressionUtils.js";
import {IfcExpressionContext} from "./context/IfcExpressionContext.js";
import {Expr} from "./expression/Expr.js";

import {IfcElementAccessor} from "./context/IfcElementAccessor.js";
import {Value} from "./value/Value.js";
import {StringValue} from "./value/StringValue.js";
import {NumericValue} from "./value/NumericValue.js";
import {BooleanValue} from "./value/BooleanValue.js";
import {LogicalValue} from "./value/LogicalValue.js";
import {LiteralValue} from "./value/LiteralValue.js";
import {ReferenceValue} from "./value/ReferenceValue.js";
import {IfcPropertySetAccessor} from "./context/IfcPropertySetAccessor.js";
import {IfcPropertyAccessor} from "./context/IfcPropertyAccessor.js";
import {IfcRootObjectAccessor} from "./context/IfcRootObjectAccessor.js";
import {IfcTypeObjectAccessor} from "./context/IfcTypeObjectAccessor.js";
import {NamedObjectAccessor} from "./context/NamedObjectAccessor.js";
import IfcExpressionParser, {ExprContext} from "./gen/parser/IfcExpressionParser.js";
import IfcExpressionVisitor from "./gen/parser/IfcExpressionVisitor.js";
import IfcExpressionLexer from "./gen/parser/IfcExpressionLexer.js";
import {ObjectAccessor} from "./context/ObjectAccessor.js";
import {IfcExpressionEvaluationException} from "./expression/IfcExpressionEvaluationException.js";
import type {LiteralValueAnyArity} from "./value/LiteralValueAnyArity.js";
import type {PrimitiveValueType} from "./value/PrimitiveValueType.js";
import {ExprEvalResult} from "./expression/ExprEvalResult";

export {
  IfcElementAccessor,
  IfcExpressionContext,
  Value,
  StringValue,
  BooleanValue,
  LogicalValue,
  NumericValue,
  LiteralValue,
  ReferenceValue,
  IfcPropertySetAccessor,
  IfcPropertyAccessor,
  IfcRootObjectAccessor,
  IfcTypeObjectAccessor,
  NamedObjectAccessor,
  ObjectAccessor,
  Expr,
  ExprVisitor,
  IfcExpressionEvaluationException,
  IfcExpressionErrorListener,
  IfcExpressionVisitor,
  isPresent,
  isNullish,
};

export type { PrimitiveValueType, LiteralValueAnyArity };

export class IfcExpression {
  public static parse(
    input: string,
    errorListener?: ErrorListener<Token>
  ): ExprContext {
    const chars = new CharStream(input); // replace this with a FileStream as required
    const lexer = new IfcExpressionLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new IfcExpressionParser(tokens);
    if (isPresent(errorListener)) {
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
    }
    return parser.expr();
  }

  public static evaluate(
    expression: string,
    context: IfcExpressionContext
  ): ExprEvalResult<any> {
    const errorListener = new IfcExpressionErrorListener();
    const tree: ExprContext = IfcExpression.parse(expression, errorListener);
    if (errorListener.isErrorOccurred()) {
      throw errorListener.getException();
    }
    const parsedExpression = this.extractExprTree(tree);
    return parsedExpression.evaluate(context, new Map<string, any>());
  }

  private static extractExprTree(
    tree: ExprContext
  ): Expr<LiteralValueAnyArity> {
    const visitor = new ExprVisitor();
    return visitor.visit(tree);
  }
}
