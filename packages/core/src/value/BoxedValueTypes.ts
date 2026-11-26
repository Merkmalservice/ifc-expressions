import Decimal from "decimal.js";
import { ObjectAccessor } from "../context/ObjectAccessor.js";

export type BoxedValueTypes =
  | Decimal
  | string
  | boolean
  | undefined
  | ObjectAccessor;
