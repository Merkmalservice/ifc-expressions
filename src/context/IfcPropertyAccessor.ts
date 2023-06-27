import { ObjectAccessor } from "./ObjectAccessor.js";
import { NamedObjectAccessor } from "./NamedObjectAccessor.js";
import { IfcPropertySetAccessor } from "./IfcPropertySetAccessor.js";
import { LiteralValueAnyArity } from "../value/LiteralValueAnyArity.js";

export abstract class IfcPropertyAccessor extends NamedObjectAccessor {
  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    switch (name) {
      case "pset":
        return this.getPropertySetAccessor();
    }
    return undefined;
  }

  listNestedObjects(): Array<string> {
    return ["pset"];
  }

  listAttributes(): Array<string> {
    return ["value", ...super.listAttributes()];
  }

  getAttribute(name: string): LiteralValueAnyArity | undefined {
    switch (name) {
      case "value":
        return this.getValue();
    }
    return super.getAttribute(name);
  }

  protected abstract getValue(): LiteralValueAnyArity;
  protected abstract getPropertySetAccessor(): IfcPropertySetAccessor;
}
