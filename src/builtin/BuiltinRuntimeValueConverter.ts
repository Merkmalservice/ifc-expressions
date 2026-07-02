import { ExprType } from "../type/ExprType.js";
import { ContextObjectType } from "../type/ContextObjectType.js";
import { ArrayType } from "../type/ArrayType.js";
import { TupleType } from "../type/TupleType.js";
import { Type, Types } from "../type/Types.js";
import { TypeDisjunction } from "../type/TypeDisjunction.js";
import { ExpressionValue } from "../value/ExpressionValue.js";
import { NumericValue } from "../value/NumericValue.js";
import { StringValue } from "../value/StringValue.js";
import { BooleanValue } from "../value/BooleanValue.js";
import { LogicalValue } from "../value/LogicalValue.js";
import { ArrayValue } from "../value/ArrayValue.js";
import { Value } from "../value/Value.js";
import { ContextObjectValue } from "../value/ContextObjectValue.js";

function isValue(candidate: unknown): candidate is Value<any> {
  return (
    typeof candidate === "object" &&
    candidate !== null &&
    typeof candidate["getValue"] === "function" &&
    typeof candidate["getType"] === "function"
  );
}

function normalizeName(name: string): string {
  return name?.replace(/^\$/, "").toUpperCase();
}

export function toExpressionValue(
  value: unknown,
  expectedType: ExprType
): ExpressionValue {
  if (isValue(value)) {
    return value as ExpressionValue;
  }

  if (expectedType instanceof TypeDisjunction) {
    for (const option of expectedType.getTypes()) {
      try {
        return toExpressionValue(value, option);
      } catch {
        // try next
      }
    }
  }

  if (expectedType instanceof ContextObjectType) {
    if (typeof value !== "object" || value === null) {
      throw new Error(
        `Expected context object value for type ${expectedType.getName()}`
      );
    }
    return new ContextObjectValue(value as Record<string, unknown>, expectedType);
  }

  if (expectedType instanceof TupleType) {
    if (!Array.isArray(value)) {
      throw new Error(`Expected tuple value for type ${expectedType.getName()}`);
    }
    const itemTypes = expectedType.getTypes();
    return ArrayValue.of(
      value.map((item, index) =>
        toExpressionValue(item, itemTypes[index] ?? Type.ANY)
      )
    );
  }

  if (expectedType instanceof ArrayType) {
    if (!Array.isArray(value)) {
      throw new Error(`Expected array value for type ${expectedType.getName()}`);
    }
    return ArrayValue.of(
      value.map((item) => toExpressionValue(item, expectedType.getElementType()))
    );
  }

  if (expectedType.isSameTypeAs(Type.NUMERIC)) {
    return NumericValue.of(value as string | number);
  }
  if (expectedType.isSameTypeAs(Type.STRING)) {
    return StringValue.of(value as string);
  }
  if (expectedType.isSameTypeAs(Type.BOOLEAN)) {
    return BooleanValue.of(value as boolean);
  }
  if (expectedType.isSameTypeAs(Type.LOGICAL)) {
    return LogicalValue.of(value as boolean | "UNKNOWN");
  }
  if (expectedType.isSameTypeAs(Type.ARRAY)) {
    if (!Array.isArray(value)) {
      throw new Error(`Expected array value for type ${expectedType.getName()}`);
    }
    return ArrayValue.of(value.map((item) => inferExpressionValue(item)));
  }

  return inferExpressionValue(value, expectedType);
}

export function inferExpressionValue(
  value: unknown,
  fallbackType: ExprType = Type.ANY
): ExpressionValue {
  if (isValue(value)) {
    return value as ExpressionValue;
  }
  if (typeof value === "number" || typeof value === "string") {
    if (typeof value === "number") {
      return NumericValue.of(value);
    }
    return StringValue.of(value);
  }
  if (typeof value === "boolean") {
    return BooleanValue.of(value);
  }
  if (value === LogicalValue.UNKNOWN_VALUE) {
    return LogicalValue.unknown();
  }
  if (Array.isArray(value)) {
    return ArrayValue.of(value.map((item) => inferExpressionValue(item)));
  }
  if (typeof value === "object" && value !== null) {
    return new ContextObjectValue(value as Record<string, unknown>, fallbackType);
  }
  throw new Error(`Cannot convert runtime context value '${value}' to expression value`);
}

export function unwrapExpressionValue(value: ExpressionValue): unknown {
  const raw = value.getValue();
  if (value instanceof ArrayValue) {
    const arrayValue = raw as Array<ExpressionValue>;
    return arrayValue.map((item) => unwrapExpressionValue(item));
  }
  return raw;
}

export function getBuiltinMemberValue(
  value: ContextObjectValue,
  memberName: string
): unknown {
  const objectValue = value.getValue();
  if (Object.prototype.hasOwnProperty.call(objectValue, memberName)) {
    return objectValue[memberName];
  }
  const normalizedMemberName = normalizeName(memberName);
  const matchingKey = Object.keys(objectValue).find(
    (key) => normalizeName(key) === normalizedMemberName
  );
  return typeof matchingKey === "undefined"
    ? undefined
    : objectValue[matchingKey];
}



