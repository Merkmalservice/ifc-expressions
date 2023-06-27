import { Expr } from "./Expr.js";
import { IfcExpressionContext } from "../context/IfcExpressionContext.js";

export abstract class Expr0<E> implements Expr<E> {
  protected constructor() {}

  abstract evaluate(ctx: IfcExpressionContext): E;
}
