import {ObjectAccessor} from "./ObjectAccessor.js";
import {IfcRootObjectAccessor} from "./IfcRootObjectAccessor.js";
import {IfcTypeObjectAccessor} from "./IfcTypeObjectAccessor.js";
import {IfcPropertyAccessor} from "./IfcPropertyAccessor.js";
import {LiteralValueAnyArity} from "../value/LiteralValueAnyArity.js";
import {StringValue} from "../value/StringValue.js";
import {isPresent} from "../IfcExpressionUtils.js";
import {IfcPropertySetAccessor} from "./IfcPropertySetAccessor.js";

export abstract class IfcElementAccessor extends IfcRootObjectAccessor {
  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    if (name === "type") {
      return this.getTypeObjectAccessor();
    }
    let val = this.getIfcPropertySetAccessor(name);
    if (isPresent(val)) {
      return val;
    }
    return this.getIfcPropertyAccessor(name);
  }

  getAttribute(name: string): LiteralValueAnyArity | undefined {
    switch (name) {
      case "ifcClass":
        return new StringValue(this.getIfcClass());
      default:
        return super.getAttribute(name);
    }
  }

  abstract getIfcClass(): string;

  listNestedObjects(): Array<string> {
    return ["type", ...this.listIfcProperties(), ...this.listIfcPropertySets()];
  }

  listAttributes(): Array<string> {
    return ["ifcClass", ...super.listAttributes()];
  }

  abstract listIfcProperties(): Array<string>;

  abstract listIfcPropertySets(): Array<string>;

  abstract getTypeObjectAccessor(): IfcTypeObjectAccessor | undefined;
  abstract getIfcPropertyAccessor(
    propertyName: string
  ): IfcPropertyAccessor | undefined;

  abstract getIfcPropertySetAccessor(
    name: string
  ): IfcPropertySetAccessor | undefined;
}
