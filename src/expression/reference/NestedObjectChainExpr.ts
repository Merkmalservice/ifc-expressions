import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr2 } from "../Expr2.js";
import { NestedObjectChainEndExpr } from "./NestedObjectChainEndExpr.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";

export class NestedObjectChainExpr extends Expr2<
  string,
  NestedObjectChainExpr | NestedObjectChainEndExpr,
  (oa: ObjectAccessor) => LiteralValueAnyArity
> {
  constructor(left: string, right: NestedObjectChainExpr) {
    super(left, right);
  }

  evaluate(
    ctx: IfcExpressionContext
  ): (oa: ObjectAccessor) => LiteralValueAnyArity {
    const nextLink = this.right.evaluate(ctx);
    return (oa: ObjectAccessor) =>
      nextLink(oa.getNestedObjectAccessor(this.left));
  }
}
