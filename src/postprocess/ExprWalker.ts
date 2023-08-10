import { Expr } from "../expression/Expr";
import { ExprVisitor } from "./ExprVisitor.js";

export class ExprWalker {
  private readonly visitor: ExprVisitor;

  constructor(visitor: ExprVisitor) {
    this.visitor = visitor;
  }

  public walk(expr: Expr<any>): void {
    this.visitor.enterExpr(expr);
    for (const child of expr.getChildren()) {
      this.walk(child);
    }
    this.visitor.exitExpr(expr);
  }
}
