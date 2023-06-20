import { IfcPropertyAccessor } from "./IfcPropertyAccessor";
import { IfcElementAccessor } from "./IfcElementAccessor";

export interface IfcExpressionContext {
  resolvePropRef(): IfcPropertyAccessor;

  resolveElemRef(): IfcElementAccessor;
}
