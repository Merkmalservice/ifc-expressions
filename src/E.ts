import { ArrayExpr } from "./expression/structure/ArrayExpr.js";
import { Expr } from "./expression/Expr.js";
import { StringConcatExpr } from "./expression/string/StringConcatExpr.js";
import { StringLiteralExpr } from "./expression/string/StringLiteralExpr.js";
import { ElemObjectReferenceExpr } from "./expression/reference/ElemObjectReferenceExpr.js";
import { PropObjectReferenceExpr } from "./expression/reference/PropObjectReferenceExpr.js";
import { NumericValue } from "./value/NumericValue.js";
import { DivideExpr } from "./expression/numeric/DivideExpr.js";
import { StringValue } from "./value/StringValue.js";
import { MinusExpr } from "./expression/numeric/MinusExpr.js";
import { MultiplyExpr } from "./expression/numeric/MultiplyExpr.js";
import { PlusExpr } from "./expression/numeric/PlusExpr.js";
import { NumericLiteralExpr } from "./expression/numeric/NumericLiteralExpr.js";
import { Decimal } from "decimal.js";
import { ParenthesisExpr } from "./expression/structure/ParenthesisExpr.js";
import { PowerExpr } from "./expression/numeric/PowerExpr.js";
import { UnaryMinusExpr } from "./expression/numeric/UnaryMinusExpr.js";
import { FunctionExpr } from "./expression/function/FunctionExpr.js";
import { BooleanValue } from "./value/BooleanValue.js";
import { AndExpr } from "./expression/boolean/AndExpr.js";
import { OrExpr } from "./expression/boolean/OrExpr.js";
import { XorExpr } from "./expression/boolean/XorExpr.js";
import { BooleanLiteralExpr } from "./expression/boolean/BooleanLiteralExpr.js";
import { NotExpr } from "./expression/boolean/NotExpr.js";
import { Logical } from "./value/LogicalValue.js";
import { LogicalLiteralExpr } from "./expression/boolean/LogicalLiteralExpr.js";

export class E {
  public static array(...elements: Array<Expr<any>>): ArrayExpr {
    return new ArrayExpr(elements);
  }
  public static concat(
    left: Expr<StringValue>,
    right: Expr<StringValue>
  ): StringConcatExpr {
    return new StringConcatExpr(left, right);
  }
  public static string(literal: string): StringLiteralExpr {
    return new StringLiteralExpr(literal);
  }
  public static element() {
    return new ElemObjectReferenceExpr();
  }
  public static property() {
    return new PropObjectReferenceExpr();
  }
  public static div(
    left: Expr<NumericValue>,
    right: Expr<NumericValue>
  ): DivideExpr {
    return new DivideExpr(left, right);
  }
  public static minus(
    left: Expr<NumericValue>,
    right: Expr<NumericValue>
  ): MinusExpr {
    return new MinusExpr(left, right);
  }
  public static multiply(
    left: Expr<NumericValue>,
    right: Expr<NumericValue>
  ): MultiplyExpr {
    return new MultiplyExpr(left, right);
  }
  public static plus(
    left: Expr<NumericValue>,
    right: Expr<NumericValue>
  ): PlusExpr {
    return new PlusExpr(left, right);
  }
  public static number(literal: number | string | Decimal): NumericLiteralExpr {
    return new NumericLiteralExpr(literal);
  }
  public static parenthesis(
    numericExpression: Expr<NumericValue>
  ): ParenthesisExpr {
    return new ParenthesisExpr(numericExpression);
  }
  public static power(
    base: Expr<NumericValue>,
    power: Expr<NumericValue>
  ): PowerExpr {
    return new PowerExpr(base, power);
  }
  public static unaryMinus(numExpr: Expr<NumericValue>): UnaryMinusExpr {
    return new UnaryMinusExpr(numExpr);
  }
  public static fun(
    functionName: string,
    ...funcArgs: Array<Expr<any>>
  ): FunctionExpr {
    return new FunctionExpr(functionName, funcArgs);
  }
  public static and(
    left: Expr<BooleanValue>,
    right: Expr<BooleanValue>
  ): AndExpr {
    return new AndExpr(left, right);
  }
  public static or(
    left: Expr<BooleanValue>,
    right: Expr<BooleanValue>
  ): OrExpr {
    return new OrExpr(left, right);
  }
  public static xor(
    left: Expr<BooleanValue>,
    right: Expr<BooleanValue>
  ): XorExpr {
    return new XorExpr(left, right);
  }
  public static boolean(literal: boolean) {
    return new BooleanLiteralExpr(literal);
  }
  public static logical(literal: Logical) {
    return new LogicalLiteralExpr(literal);
  }
  public static not(booleanExpr: Expr<BooleanValue>): NotExpr {
    return new NotExpr(booleanExpr);
  }
}
