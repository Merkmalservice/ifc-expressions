import { NamedObjectAccessor } from "./NamedObjectAccessor.js";
import { ExpressionValue } from "../value/ExpressionValue.js";
import { StringValue } from "../value/StringValue.js";

export abstract class IfcRootObjectAccessor extends NamedObjectAccessor {
  getAttribute(name: string): ExpressionValue | undefined {
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
