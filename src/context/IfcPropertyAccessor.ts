import { isObjectAccessor, ObjectAccessor } from "./ObjectAccessor.js";
import { NamedObjectAccessor } from "./NamedObjectAccessor.js";
import { IfcPropertySetAccessor } from "./IfcPropertySetAccessor.js";
import { ExpressionValue } from "../value/ExpressionValue.js";

export abstract class IfcPropertyAccessor extends NamedObjectAccessor {
  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    switch (name) {
      case "pset":
        return this.getIfcPropertySetAccessor();
    }
    return undefined;
  }

  listNestedObjects(): Array<string> {
    return ["pset"];
  }

  listAttributes(): Array<string> {
    return ["value", ...super.listAttributes()];
  }

  getAttribute(name: string): ExpressionValue | undefined {
    switch (name) {
      case "value":
        return this.getValue();
    }
    return super.getAttribute(name);
  }

  abstract getValue(): ExpressionValue;
  abstract getIfcPropertySetAccessor(): IfcPropertySetAccessor;
}

export function isIfcPropertyAccessor(arg: any): arg is IfcPropertyAccessor {
  return (
    typeof arg.getGuid === "undefined" &&
    typeof arg.getName === "function" &&
    typeof arg.getDescription === "function" &&
    typeof arg.getIfcClass === "undefined" &&
    typeof arg.getIfcPropertySetAccessor === "function" &&
    typeof arg.getIfcPropertyAccessor === "undefined" &&
    typeof arg.getIfcTypeObjectAccessor === "undefined" &&
    isObjectAccessor(arg)
  );
}
