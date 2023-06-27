import { Expr } from "./Expr.js";
import { IfcExpressionContext } from "../context/IfcExpressionContext.js";

export abstract class Expr1<V, E> implements Expr<E> {
  readonly value: V;

  protected constructor(value: V) {
    this.value = value;
  }

  abstract evaluate(ctx: IfcExpressionContext): E;
}
