import { IfcRootObjectAccessor } from "./IfcRootObjectAccessor.js";
import { LiteralValueAnyArity } from "../value/LiteralValueAnyArity.js";
import { IfcPropertyAccessor } from "./IfcPropertyAccessor.js";
import { ObjectAccessor } from "./ObjectAccessor.js";

export abstract class IfcPropertySetAccessor extends IfcRootObjectAccessor {
  listAttributes(): Array<string> {
    return [...super.listAttributes(), ...this.listIfcProperties()];
  }

  getAttribute(name: string): LiteralValueAnyArity | undefined {
    return super.getAttribute(name);
  }

  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    return this.getIfcPropertyAccessor(name);
  }

  protected abstract listIfcProperties(): Array<string>;
  protected abstract getIfcPropertyAccessor(
    name: string
  ): IfcPropertyAccessor | undefined;
}
