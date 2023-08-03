import { isObjectAccessor, ObjectAccessor } from "./ObjectAccessor.js";
import { IfcRootObjectAccessor } from "./IfcRootObjectAccessor.js";
import { IfcPropertySetAccessor } from "./IfcPropertySetAccessor.js";
import { isPresent } from "../IfcExpressionUtils.js";
import { IfcPropertyAccessor } from "./IfcPropertyAccessor.js";
import { IfcElementAccessor } from "./IfcElementAccessor.js";

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

  abstract getIfcPropertySetAccessor(
    name: string
  ): IfcPropertySetAccessor | undefined;

  abstract getIfcPropertyAccessor(
    name: string
  ): IfcPropertyAccessor | undefined;

  abstract listIfcPropertySetNames(): Array<string>;
  abstract listIfcPropertyNames(): Array<string>;
}

export function isIfcTypeObjectAccessor(
  arg: any
): arg is IfcTypeObjectAccessor {
  return (
    typeof arg.getGuid === "function" &&
    typeof arg.getName === "function" &&
    typeof arg.getDescription === "function" &&
    typeof arg.getIfcClass === "undefined" &&
    typeof arg.getIfcPropertySetAccessor === "function" &&
    typeof arg.getIfcPropertyAccessor === "function" &&
    typeof arg.getIfcTypeObjectAccessor === "undefined" &&
    isObjectAccessor(arg)
  );
}
