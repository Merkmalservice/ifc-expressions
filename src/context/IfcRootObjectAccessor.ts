import { NamedObjectAccessor } from "./NamedObjectAccessor.js";
import { LiteralValueAnyArity } from "../value/LiteralValueAnyArity.js";
import { StringValue } from "../value/StringValue.js";

export abstract class IfcRootObjectAccessor extends NamedObjectAccessor {
  getAttribute(name: string): LiteralValueAnyArity | undefined {
    switch (name) {
      case "guid":
        return new StringValue(this.getGuid());
    }
    return super.getAttribute(name);
  }

  abstract getGuid(): string;

  listAttributes(): Array<string> {
    return ["guid", ...super.listAttributes()];
  }
}
