import { NumericValue } from "./NumericValue.js";
import { StringValue } from "./StringValue.js";
import { BooleanValue } from "./BooleanValue.js";
import { LogicalValue } from "./LogicalValue.js";
import { ReferenceValue } from "./ReferenceValue.js";
import { ArrayValue } from "./ArrayValue.js";
import { ObjectAccessorValue } from "./ObjectAccessorValue.js";
import { IfcDateValue } from "./IfcDateValue.js";
import { IfcDateTimeValue } from "./IfcDateTimeValue.js";
import { IfcTimeValue } from "./IfcTimeValue.js";
import { IfcDurationValue } from "./IfcDurationValue.js";
import { IfcTimeStampValue } from "./IfcTimeStampValue.js";

export type ExpressionValue =
  | NumericValue
  | StringValue
  | BooleanValue
  | LogicalValue
  | IfcDateValue
  | IfcDateTimeValue
  | IfcTimeValue
  | IfcDurationValue
  | IfcTimeStampValue
  | ReferenceValue
  | ObjectAccessorValue
  | ArrayValue;
