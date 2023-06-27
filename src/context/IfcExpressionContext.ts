import { IfcPropertyAccessor } from "./IfcPropertyAccessor.js";
import { IfcElementAccessor } from "./IfcElementAccessor.js";

export interface IfcExpressionContext {
  resolvePropRef(): IfcPropertyAccessor;

  resolveElemRef(): IfcElementAccessor;
}
