import { IfcExpressionContext } from "../../context/IfcExpressionContext";
import { ObjectReferenceExpr } from "./ObjectReferenceExpr";
import { ObjectAccessor } from "../../context/ObjectAccessor";
import { Expr0 } from "../Expr0";

export class ElemObjectReferenceExpr
  extends Expr0<ObjectAccessor>
  implements ObjectReferenceExpr
{
  constructor() {
    super();
  }

  evaluate(ctx: IfcExpressionContext): ObjectAccessor {
    return ctx.resolveElemRef();
  }
}
