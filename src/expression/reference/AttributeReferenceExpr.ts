import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { Expr2 } from "../Expr2";
import { NestedObjectChainExpr } from "./NestedObjectChainExpr";
import { ObjectReferenceExpr } from "./ObjectReferenceExpr";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity";
import { ObjectAccessor } from "../../context/ObjectAccessor";

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
