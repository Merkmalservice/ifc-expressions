import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr0 } from "../Expr0.js";
import { ObjectReferenceExpr } from "./ObjectReferenceExpr.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";
import { ExprKind } from "../ExprKind.js";

export class PropObjectReferenceExpr
  extends Expr0<ObjectAccessor>
  implements ObjectReferenceExpr
{
  constructor() {
    super(ExprKind.REF_PROPERTY);
  }

  doEvaluate(ctx: IfcExpressionContext): ObjectAccessor {
    return ctx.resolvePropRef();
  }
}
