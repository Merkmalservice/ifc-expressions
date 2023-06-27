import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr0 } from "../Expr0.js";
import { ObjectReferenceExpr } from "./ObjectReferenceExpr.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";

export class PropObjectReferenceExpr
  extends Expr0<ObjectAccessor>
  implements ObjectReferenceExpr
{
  constructor() {
    super();
  }

  evaluate(ctx: IfcExpressionContext): ObjectAccessor {
    return ctx.resolvePropRef();
  }
}
