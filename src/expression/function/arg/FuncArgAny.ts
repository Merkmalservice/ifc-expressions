import { FuncArgBase } from "./FuncArgBase.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ExprKind } from "../../ExprKind.js";
import { NumericValue } from "../../../value/NumericValue.js";
import {Type} from "../../../parse/Types";

export class FuncArgAny extends FuncArgBase<ExpressionValue> {
  constructor(required: boolean, name: string, defaultValue?: ExpressionValue) {
    super(required, name, defaultValue);
  }


  getType(): Type {
    return Type.ANY;
  }

}
