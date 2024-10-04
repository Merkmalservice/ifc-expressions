import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { IfcTimeStampValue } from "../../../value/IfcTimeStampValue.js";
import { FuncArgIfcDateTime } from "../arg/FuncArgIfcDateTime.js";
import { FuncArgIfcDuration } from "../arg/FuncArgIfcDuration.js";
import { IfcDurationValue } from "../../../value/IfcDurationValue.js";
import { FuncArgUnion } from "../arg/FuncArgUnion.js";
import { FuncArgIfcTimeStamp } from "../arg/FuncArgIfcTimeStamp.js";
import { FuncArgIfcDurationString } from "../arg/FuncArgIfcDurationString.js";

export class ADDDURATION extends Func {
  constructor() {
    super("ADDDURATION", [
      FuncArgUnion.of(true, "pointInTime", [
        FuncArgIfcTimeStamp,
        FuncArgIfcDateTime,
      ]),
      FuncArgUnion.of(true, "duration", [
        FuncArgIfcDuration,
        FuncArgIfcDurationString,
      ]),
    ]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const durationArg = evaluatedArguments.get("duration");
    var duration: IfcDurationValue;
    if (durationArg instanceof IfcDurationValue) {
      duration = durationArg;
    } else if (durationArg instanceof StringValue) {
      duration = IfcDurationValue.of(durationArg.getValue());
    }
    const pointInTime = evaluatedArguments.get("pointInTime");
    if (pointInTime instanceof IfcDateTimeValue) {
      return new ExprEvalSuccessObj(
        (pointInTime as IfcDateTimeValue).addDuration(duration)
      );
    } else if (pointInTime instanceof IfcTimeStampValue) {
      return new ExprEvalSuccessObj(
        (pointInTime as IfcTimeStampValue)
          .toIfcDateTimeValue()
          .addDuration(duration)
          .toIfcTimeStampValue()
      );
    }
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return argumentTypes[0];
  }
}
