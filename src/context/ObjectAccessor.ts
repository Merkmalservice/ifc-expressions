import { ExpressionValue } from "../value/ExpressionValue.js";

export interface ObjectAccessor {
  /**
   * If there is a nested object with the specified name (.e.g the 'pset' in $prop.pset),
   * return an ObjectAccessor for it.
   * @param name
   */
  getNestedObjectAccessor(name: string): ObjectAccessor | undefined;

  /**
   * If the object has the attribute of the specified name, return it as (an array of (array of)) LiteralValue.
   * @param name
   */
  getAttribute(name: string): ExpressionValue | undefined;

  listNestedObjects(): Array<string>;

  listAttributes(): Array<string>;
}

export function isObjectAccessor(arg: any): arg is ObjectAccessor {
  return (
    typeof arg === "object" &&
    typeof arg.getNestedObjectAccessor === "function" &&
    typeof arg.getAttribute === "function" &&
    typeof arg.listNestedObjects === "function" &&
    typeof arg.listAttributes === "function"
  );
}
