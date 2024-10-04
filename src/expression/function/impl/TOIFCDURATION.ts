import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgIfcDurationString } from "../arg/FuncArgIfcDurationString.js";
import { IfcDurationValue } from "../../../value/IfcDurationValue.js";

export class TOIFCDURATION extends Func {
  constructor() {
    super("TOIFCDURATION", [new FuncArgIfcDurationString(true, "duration")]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    return new ExprEvalSuccessObj(
      IfcDurationValue.of(
        (evaluatedArguments.get("duration") as StringValue).getValue()
      )
    );
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_DURATION;
  }
}
