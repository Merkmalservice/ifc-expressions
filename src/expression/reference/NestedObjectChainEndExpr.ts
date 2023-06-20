import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { Expr1 } from "../Expr1";
import { ObjectAccessor } from "../../context/accessor/ObjectAccessor";
import { LiteralValueAnyArity } from "../../context/value/LiteralValueAnyArity";

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
