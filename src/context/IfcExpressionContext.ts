import { ExprType } from "../type/ExprType.js";

export interface IfcExpressionContext {
  resolvePropRef();

  resolveElemRef();

  resolveBuiltinVariable(name: string): unknown;
}
