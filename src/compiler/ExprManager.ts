import { ParserRuleContext } from "antlr4";
import { Expr } from "../expression/Expr.js";
import { ValidationException } from "../error/ValidationException.js";
import { isNullish } from "../util/IfcExpressionUtils.js";

export class ExprManager {
  private readonly contextToExpr = new Map<Expr<any>, ParserRuleContext>();

  constructor() {}

  public registerExprWithContext(expr: Expr<any>, ctx) {
    const otherCtx = this.contextToExpr.get(expr);
    if (!isNullish(otherCtx) && otherCtx !== ctx) {
      throw new ValidationException(
        `Expression (of kind '${expr.getKind}') at line ${ctx.start.line}, column ${ctx.start.start} is already associated with a ParserRuleContext of type ${otherCtx.constructor.name}' cannot associate it with another one (${ctx.constructor.name} at ${ctx.start.line}:${ctx.start.start}')`,
        ctx
      );
    }
    this.contextToExpr.set(expr, ctx);
  }

  getContext(expr: Expr<any>) {
    return this.contextToExpr.get(expr);
  }
}
