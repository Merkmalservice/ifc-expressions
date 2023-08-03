import { IfcRootObjectAccessor } from "./IfcRootObjectAccessor.js";
import { ExpressionValue } from "../value/ExpressionValue.js";
import { IfcPropertyAccessor } from "./IfcPropertyAccessor.js";
import { ObjectAccessor } from "./ObjectAccessor.js";

export abstract class IfcPropertySetAccessor extends IfcRootObjectAccessor {
  listAttributes(): Array<string> {
    return [...super.listAttributes(), ...this.listIfcPropertyNames()];
  }

  getAttribute(name: string): ExpressionValue | undefined {
    return super.getAttribute(name);
  }

  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    return this.getIfcPropertyAccessor(name);
  }

  abstract listIfcPropertyNames(): Array<string>;
  abstract getIfcPropertyAccessor(
    name: string
  ): IfcPropertyAccessor | undefined;
}
