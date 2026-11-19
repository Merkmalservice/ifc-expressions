import type { ContextObjectType } from "./ContextObjectType.js";
import type { ContextObjectValue } from "../value/ContextObjectValue.js";

/** Operators that a nominal context-object factory may opt into. */
export enum ContextObjectOperator {
  EQUALS = "==",
}

export type ContextObjectBinaryOperator<T = unknown> = (
  left: T,
  right: T
) => boolean;

/**
 * Creates values for one nominal context-object type and declares its
 * supported operators. Factory object identity is the nominal type identity.
 */
export interface ContextObjectTypeFactory<T = unknown> {
  createValue(value: T, type: ContextObjectType): ContextObjectValue<T>;

  getBinaryOperator(
    operator: ContextObjectOperator
  ): ContextObjectBinaryOperator<T> | undefined;
}
