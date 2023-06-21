import { CharStream, CommonTokenStream, ErrorListener, Token } from "antlr4";
import { ExprVisitor } from "./ExprVisitor";
import { IfcExpressionErrorListener } from "./IfcExpressionErrorListener";
import { notNullish } from "./utils";
import { IfcExpressionContext } from "./context/IfcExpressionContext";
import { Expr } from "./expression/Expr";
import IfcExpressionParser, {
  ExprContext,
} from "../generated/parser/IfcExpressionParser";
import IfcExpressionLexer from "../generated/parser/IfcExpressionLexer";

import { IfcElementAccessor } from "./context/IfcElementAccessor";
import { Value } from "./value/Value";
import { StringValue } from "./value/StringValue";
import { NumericValue } from "./value/NumericValue";
import { BooleanValue } from "./value/BooleanValue";
import { LogicalValue } from "./value/LogicalValue";
import { LiteralValue } from "./value/LiteralValue";
import { ReferenceValue } from "./value/ReferenceValue";
import { IfcPropertySetAccessor } from "./context/IfcPropertySetAccessor";
import { IfcPropertyAccessor } from "./context/IfcPropertyAccessor";
import { IfcRootObjectAccessor } from "./context/IfcRootObjectAccessor";
import { IfcTypeObjectAccessor } from "./context/IfcTypeObjectAccessor";
import { NamedObjectAccessor } from "./context/NamedObjectAccessor";
import { ObjectAccessor } from "./context/ObjectAccessor";
import { IfcExpressionEvaluationException } from "./expression/IfcExpressionEvaluationException";
import IfcExpressionVisitor from "../generated/parser/IfcExpressionVisitor";
import type { LiteralValueAnyArity } from "./value/LiteralValueAnyArity";
import type { PrimitiveValueType } from "./value/PrimitiveValueType";
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
    if (notNullish(errorListener)) {
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
    }
    return parser.expr();
  }

  public static evaluate(
    expression: string,
    context: IfcExpressionContext
  ): LiteralValueAnyArity {
    const errorListener = new IfcExpressionErrorListener();
    const tree: ExprContext = IfcExpression.parse(expression, errorListener);
    if (errorListener.isErrorOccurred()) {
      throw errorListener.getException();
    }
    const parsedExpression = this.extractExprTree(tree);
    return parsedExpression.evaluate(context);
  }

  private static extractExprTree(tree: ExprContext): Expr<any> {
    const visitor = new ExprVisitor();
    return visitor.visit(tree);
  }
}
