import { ObjectAccessor } from "./ObjectAccessor.js";
import { LiteralValueAnyArity } from "../value/LiteralValueAnyArity.js";
import { StringValue } from "../value/StringValue.js";

export abstract class NamedObjectAccessor implements ObjectAccessor {
  abstract getName(): string;

  abstract getDescription(): string;

  getAttribute(name: string): LiteralValueAnyArity | undefined {
    switch (name) {
      case "name":
        return new StringValue(this.getName());
      case "description":
        return new StringValue(this.getDescription());
    }
    return undefined;
  }

  listAttributes(): Array<string> {
    return ["name", "description"];
  }

  getNestedObjectAccessor(name: string): ObjectAccessor | undefined {
    return undefined;
  }

  listNestedObjects(): Array<string> {
    return [];
  }
}
