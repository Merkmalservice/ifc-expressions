import { LiteralValue } from "./LiteralValue";

export type LiteralValueAnyArity =
  | LiteralValue
  | Array<LiteralValue>
  | Array<Array<LiteralValue>>;
