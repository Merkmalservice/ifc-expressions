import { Expr } from "../expression/Expr.js";

export class ExprVisitor {
  enterExpr(expr: Expr<any>) {}
  exitExpr(expr: Expr<any>) {}
}
