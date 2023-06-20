import { IfcPropertyAccessor } from "./accessor/IfcPropertyAccessor";
import { IfcElementAccessor } from "./accessor/IfcElementAccessor";

export interface IfcExpressionContext {
  resolvePropRef(): IfcPropertyAccessor;

  resolveElemRef(): IfcElementAccessor;
}
