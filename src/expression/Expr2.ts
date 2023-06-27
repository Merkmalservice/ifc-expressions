import { Expr } from "./Expr.js";
import { IfcExpressionContext } from "../context/IfcExpressionContext.js";

export abstract class Expr2<L, R, E> implements Expr<E> {
  readonly left: L;
  readonly right: R;

  protected constructor(left: L, right: R) {
    this.left = left;
    this.right = right;
  }

  abstract evaluate(ctx: IfcExpressionContext): E;
}
