import {
  CharStream,
  CommonTokenStream,
  ErrorListener,
  ParseTreeWalker,
  Token,
} from "antlr4";
import { ExprVisitor } from "./ExprVisitor.js";
import { IfcExpressionErrorListener } from "./IfcExpressionErrorListener.js";
import { IfcExpressionValidationListener } from "./IfcExpressionValidationListener.js";

import { isNullish, isPresent } from "./IfcExpressionUtils.js";
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
import IfcExpressionParser, {
  ExprContext,
} from "./gen/parser/IfcExpressionParser.js";
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
  ExprVisitor,
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
};

export type { BoxedValueTypes };

export class IfcExpression {
  public static parse(
    input: string,
    errorListener?: ErrorListener<Token | number>
  ): ExprContext {
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
    const expr = parser.expr();
    if (!myErrorListener.isErrorOccurred()) {
      const walker = new ParseTreeWalker();
      try {
        walker.walk(new IfcExpressionValidationListener(), expr);
      } catch (e) {
        if (e instanceof ValidationException) {
          if (errorListener instanceof IfcExpressionErrorListener) {
            errorListener.validationException(e);
          }
          myErrorListener.validationException(e);
        }
      }
    }
    return expr;
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

  private static extractExprTree(tree: ExprContext): Expr<ExpressionValue> {
    const visitor = new ExprVisitor();
    return visitor.visit(tree);
  }
}
