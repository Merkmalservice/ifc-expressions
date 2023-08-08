import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr0 } from "../Expr0.js";
import { ExprKind } from "../ExprKind.js";
import { ObjectAccessorValue } from "../../value/ObjectAccessorValue.js";
import { ExprType } from "../../type/ExprType.js";
import { Type } from "../../type/Types.js";

export class PropObjectReferenceExpr extends Expr0<ObjectAccessorValue> {
  constructor() {
    super(ExprKind.REF_PROPERTY);
  }

  doEvaluate(ctx: IfcExpressionContext): ObjectAccessorValue {
    return new ObjectAccessorValue(ctx.resolvePropRef());
  }

  toExprString(): string {
    return "$property";
  }

  getType(): ExprType {
    return Type.IFC_PROPERTY_REF;
  }
}
