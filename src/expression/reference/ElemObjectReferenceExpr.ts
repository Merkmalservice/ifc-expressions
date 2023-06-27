import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ObjectReferenceExpr } from "./ObjectReferenceExpr.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";
import { Expr0 } from "../Expr0.js";

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
