import { LiteralValue } from "./LiteralValue.js";

export type LiteralValueAnyArity =
  | LiteralValue
  | Array<LiteralValue>
  | Array<Array<LiteralValue>>;
