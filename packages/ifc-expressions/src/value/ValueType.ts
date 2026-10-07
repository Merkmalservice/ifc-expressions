import { IfcDateTimeValue } from "./IfcDateTimeValue.js";
import { IfcDateValue } from "./IfcDateValue.js";
import { IfcTimeValue } from "./IfcTimeValue.js";
import { IfcDurationValue } from "./IfcDurationValue.js";
import { IfcTimeStampValue } from "./IfcTimeStampValue.js";

export type ValueType =
  | IfcDateValue
  | IfcDateTimeValue
  | IfcTimeValue
  | IfcDurationValue
  | IfcTimeStampValue;
