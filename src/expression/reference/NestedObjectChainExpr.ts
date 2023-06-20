import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { Expr2 } from "../Expr2";
import { NestedObjectChainEndExpr } from "./NestedObjectChainEndExpr";
import { ObjectAccessor } from "../../context/accessor/ObjectAccessor";
import { LiteralValueAnyArity } from "../../context/value/LiteralValueAnyArity";

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
