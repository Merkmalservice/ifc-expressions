import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { FuncArgIfcDateTimeString } from "../arg/FuncArgIfcDateTimeString.js";
import { IfcTimeStampValue } from "../../../value/IfcTimeStampValue.js";
import { FuncArgUnion } from "../arg/FuncArgUnion.js";
import { FuncArgIfcTimeStamp } from "../arg/FuncArgIfcTimeStamp.js";

export class TOIFCDATETIME extends Func {
  constructor() {
    super("TOIFCDATETIME", [
      FuncArgUnion.of(true, "pointInTime", [
        FuncArgIfcDateTimeString,
        FuncArgIfcTimeStamp,
      ]),
    ]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const value = evaluatedArguments.get("pointInTime");
    if (value instanceof StringValue) {
      return new ExprEvalSuccessObj(
        IfcDateTimeValue.of((value as StringValue).getValue())
      );
    } else if (value instanceof IfcTimeStampValue) {
      return new ExprEvalSuccessObj(
        (value as IfcTimeStampValue).toIfcDateTimeValue()
      );
    }
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_DATE_TIME;
  }
}
