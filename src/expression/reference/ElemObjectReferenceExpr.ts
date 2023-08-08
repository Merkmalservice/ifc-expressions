import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr0 } from "../Expr0.js";
import { ExprKind } from "../ExprKind.js";
import { ObjectAccessorValue } from "../../value/ObjectAccessorValue.js";
import { ExprType } from "../../type/ExprType.js";
import { Type } from "../../type/Types.js";

export class ElemObjectReferenceExpr extends Expr0<ObjectAccessorValue> {
  constructor() {
    super(ExprKind.REF_ELEMENT);
  }

  doEvaluate(ctx: IfcExpressionContext): ObjectAccessorValue {
    return ObjectAccessorValue.of(ctx.resolveElemRef());
  }

  toExprString(): string {
    return `$element`;
  }

  getType(): ExprType {
    return Type.IFC_ELEMENT_REF;
  }
}
