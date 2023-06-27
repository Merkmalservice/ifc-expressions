import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr2 } from "../Expr2.js";
import { NestedObjectChainExpr } from "./NestedObjectChainExpr.js";
import { ObjectReferenceExpr } from "./ObjectReferenceExpr.js";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";

export class AttributeReferenceExpr extends Expr2<
  ObjectReferenceExpr,
  NestedObjectChainExpr,
  LiteralValueAnyArity
> {
  constructor(left: ObjectReferenceExpr, right: NestedObjectChainExpr) {
    super(left, right);
  }

  evaluate(ctx: IfcExpressionContext): LiteralValueAnyArity {
    const oa: ObjectAccessor = this.left.evaluate(ctx);
    const valueAccessor = this.right.evaluate(ctx);
    return valueAccessor(oa);
  }
}
