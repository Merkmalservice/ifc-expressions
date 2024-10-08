import { ExprType } from "../src/type/ExprType.js";
import { Type, Types } from "../src/type/Types.js";
import { IfcDurationValue } from "../src/value/IfcDurationValue";

describe.each([
  ["P10Y10M10W10DT10H10M10S", true, null],
  ["P3Y6M4DT12H30M5S", true, null],
  [
    "P10Y10M10DT10H10M10.00000000000000000000000000000000000000000000001S",
    true,
    null,
  ],
  ["P10Y10M10DT10H10.34M", true, null],
  ["P10Y10M10DT10.34H", true, null],
  ["P10Y10M10.34D", true, null],
  ["P10Y10.34M", true, null],
  ["P10.34Y", true, null],
  ["P10Y", true, null],
  ["P10Y10M10DT10.34H10M10S", false, "fraction only allowed at the end"],
  [
    "P10.5Y10.5M10.5DT10.34H10.5M10.5S",
    false,
    "fraction only allowed at the end",
  ],
  ["PY10M10DT10H10M10S", false, "missing digits before Y"],
  ["P10YM10DT10H10M10S", false, "missing digits before M"],
  ["P10YMW10DT10H10M10S", false, "missing digits before W"],
  ["P10Y10MDT10H10M10S", false, "missing digits before D"],
  ["P10Y10M10DTH10M10S", false, "missing digits before H"],
  ["P10Y10M10DT10HM10S", false, "missing digits before M (minute)"],
  ["P10Y10M10DT10HMS", false, "missing digits before S"],
  ["P10Y10M10DT10H10M", true, null],
  ["P10Y10M10DT10H", true, null],
  ["P10Y10M10D", true, null],
  ["P10Y10M", true, null],
  ["P10Y", true, null],
  ["P10Y10M10DT10H10M10", false, "missing S"],
  ["P10Y10M10DT10H10    ", false, "missing S or M"],
  ["P10Y10M10DT10", false, "missing H, M or S"],
  ["P10Y10M10DT", false, "spurious T"],
  ["P10Y10M10", false, "missing D"],
  ["P10Y10M10", false, "missing W or D"],
  ["P10Y10", false, "missing M, W or D"],
  ["P10", false, "missing Y, M, W or D"],
  ["P10YT10S", true, null],
  ["P3YT1M", true, null],
  ["P3Y1M", true, null],
  ["P10Y10DT10M10S", true, null],
  ["P4Y", true, null],
  ["5Y", false, "missing P"],
  ["P", false, "no duration specified"],
  ["PM", false, "missing digits before M"],
  ["P0M", true, null],
  ["PT1M", true, null],
  ["P1M", true, null],
  ["P13M", true, null],
  ["P31D", true, null],
  ["PT24H", true, null],
  ["PT60M", true, null],
  ["PT60S", true, null],
  ["10Y10M10DT10H10M10S", false, "missing P"],
  ["P10YM12D10T10H10M10S", false, "spurious digits before T"],
  ["P10Y22M10DT10H10M10S", true, null],
  ["P10Y10M33DT10H10M10S", true, null],
  ["P10Y10M10DT24H10M10S", true, null],
  ["P10Y10M10DT10H60M10S", true, null],
  ["P10Y10M10DT10H10M59S", true, null],
  ["P1YMDTHMS", false, null],
  ["P10Y10M10DT10S10M10H", false, "wrong order"],
  ["P10Y10M10DT10S10H", false, "wrong order"],
  ["P10Y10DT10S10M10H", false, "wrong order"],
  ["P10M10Y", false, "wrong order"],
  ["P10M10", false, "ends with digit"],
  ["P10T5M10", false, "ends with digit"],
  ["P3Y6M4DT12H30M5", false, "ends with digit"],
])(
  "checking IfcDurationValue.isValidStringRepresentation",
  (input: string, expected: boolean, reason: string) => {
    it(` IfcDurationValue.isValidStringRepresentation(${input}) == ${expected} ${
      reason ?? ""
    }`, () => {
      expect(IfcDurationValue.isValidStringRepresentation(input)).toBe(
        expected
      );
    });
  }
);
