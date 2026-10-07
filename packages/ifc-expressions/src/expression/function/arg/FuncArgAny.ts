import { FuncArgBase } from "./FuncArgBase.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";

export class FuncArgAny extends FuncArgBase<ExpressionValue> {
  constructor(required: boolean, name: string, defaultValue?: ExpressionValue) {
    super(required, name, defaultValue);
  }

  getType(): ExprType {
    return Type.ANY;
  }
}
