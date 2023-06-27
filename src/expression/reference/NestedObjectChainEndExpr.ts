import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr1 } from "../Expr1.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";

export class NestedObjectChainEndExpr extends Expr1<
  string,
  (oa: ObjectAccessor) => LiteralValueAnyArity
> {
  constructor(value: string) {
    super(value);
  }

  evaluate(
    ctx: IfcExpressionContext
  ): (oa: ObjectAccessor) => LiteralValueAnyArity {
    return (oa: ObjectAccessor) => oa.getAttribute(this.value);
  }
}
