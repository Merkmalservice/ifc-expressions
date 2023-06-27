import { ObjectAccessor } from "./ObjectAccessor.js";
import { IfcRootObjectAccessor } from "./IfcRootObjectAccessor.js";
import { IfcPropertySetAccessor } from "./IfcPropertySetAccessor.js";
import { isPresent } from "../IfcExpressionUtils.js";
import { IfcPropertyAccessor } from "./IfcPropertyAccessor.js";

export abstract class IfcTypeObjectAccessor extends IfcRootObjectAccessor {
  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    let val = this.getIfcPropertyAccessor(name);
    if (isPresent(val)) {
      return val;
    }
    return this.getIfcPropertySetAccessor(name);
  }

  listNestedObjects(): Array<string> {
    return [...this.listIfcPropertyNames(), ...this.listIfcPropertySetNames()];
  }

  listAttributes(): Array<string> {
    return [...super.listAttributes()];
  }

  protected abstract getIfcPropertySetAccessor(
    name: string
  ): IfcPropertySetAccessor | undefined;

  protected abstract getIfcPropertyAccessor(
    name: string
  ): IfcPropertyAccessor | undefined;

  abstract listIfcPropertySetNames(): Array<string>;
  abstract listIfcPropertyNames(): Array<string>;
}
