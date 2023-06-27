import { LiteralValueAnyArity } from "../value/LiteralValueAnyArity.js";

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
  getAttribute(name: string): LiteralValueAnyArity | undefined;

  listNestedObjects(): Array<string>;

  listAttributes(): Array<string>;
}
