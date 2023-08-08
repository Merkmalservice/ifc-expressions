import { isObjectAccessor, ObjectAccessor } from "./ObjectAccessor.js";
import { IfcRootObjectAccessor } from "./IfcRootObjectAccessor.js";
import { IfcTypeObjectAccessor } from "./IfcTypeObjectAccessor.js";
import { IfcPropertyAccessor } from "./IfcPropertyAccessor.js";
import { ExpressionValue } from "../value/ExpressionValue.js";
import { StringValue } from "../value/StringValue.js";
import { isPresent } from "../IfcExpressionUtils.js";
import { IfcPropertySetAccessor } from "./IfcPropertySetAccessor.js";

export abstract class IfcElementAccessor extends IfcRootObjectAccessor {
  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    if (name === "type") {
      return this.getIfcTypeObjectAccessor();
    }
    let val = this.getIfcPropertySetAccessor(name);
    if (isPresent(val)) {
      return val;
    }
    return this.getIfcPropertyAccessor(name);
  }

  getAttribute(name: string): ExpressionValue | undefined {
    switch (name) {
      case "ifcClass":
        return new StringValue(this.getIfcClass());
      default:
        return super.getAttribute(name);
    }
  }

  abstract getIfcClass(): string;

  listNestedObjects(): Array<string> {
    return [
      "type",
      ...this.listIfcPropertyNames(),
      ...this.listIfcPropertySetNames(),
    ];
  }

  listAttributes(): Array<string> {
    return ["ifcClass", ...super.listAttributes()];
  }

  abstract listIfcPropertyNames(): Array<string>;

  abstract listIfcPropertySetNames(): Array<string>;

  abstract getIfcTypeObjectAccessor(): IfcTypeObjectAccessor | undefined;
  abstract getIfcPropertyAccessor(
    propertyName: string
  ): IfcPropertyAccessor | undefined;

  abstract getIfcPropertySetAccessor(
    name: string
  ): IfcPropertySetAccessor | undefined;
}

export function isIfcElementAccessor(arg: any): arg is IfcElementAccessor {
  return (
    typeof arg.getGuid === "function" &&
    typeof arg.getName === "function" &&
    typeof arg.getDescription === "function" &&
    typeof arg.getIfcClass === "function" &&
    typeof arg.getIfcPropertySetAccessor === "function" &&
    typeof arg.getIfcPropertyAccessor === "function" &&
    typeof arg.getIfcTypeObjectAccessor === "function" &&
    isObjectAccessor(arg)
  );
}
