import {IfcPropertyAccessor} from "./accessor/IfcPropertyAccessor";
import {IfcElementAccessor} from "./accessor/IfcElementAccessor";

export interface MmsExpressionContext {
     resolvePropRef(): IfcPropertyAccessor;

     resolveElemRef(): IfcElementAccessor;
}




