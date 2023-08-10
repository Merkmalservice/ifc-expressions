import { Expr } from "../expression/Expr";

export class ExprVisitor {
  enterExpr(expr: Expr<any>) {}
  exitExpr(expr: Expr<any>) {}
}
