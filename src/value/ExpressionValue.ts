import { NumericValue } from "./NumericValue.js";
import { StringValue } from "./StringValue.js";
import { BooleanValue } from "./BooleanValue.js";
import { LogicalValue } from "./LogicalValue.js";
import { ReferenceValue } from "./ReferenceValue.js";
import { ArrayValue } from "./ArrayValue.js";
import { ObjectAccessorValue } from "./ObjectAccessorValue.js";

export type ExpressionValue =
  | NumericValue
  | StringValue
  | BooleanValue
  | LogicalValue
  | ReferenceValue
  | ObjectAccessorValue
  | ArrayValue;
