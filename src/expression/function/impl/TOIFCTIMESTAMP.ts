import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgIfcTimeStampNumeric } from "../arg/FuncArgIfcTimeStampNumeric.js";
import { IfcTimeStampValue } from "../../../value/IfcTimeStampValue.js";
import { NumericValue } from "../../../IfcExpression.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { FuncArgUnion } from "../arg/FuncArgUnion.js";
import { FuncArgIfcDateTime } from "../arg/FuncArgIfcDateTime.js";

export class TOIFCTIMESTAMP extends Func {
  constructor() {
    super("TOIFCTIMESTAMP", [
      FuncArgUnion.of(true, "timeStamp", [
        FuncArgIfcTimeStampNumeric,
        FuncArgIfcDateTime,
      ]),
    ]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const input = evaluatedArguments.get("timeStamp");
    if (input instanceof NumericValue) {
      return new ExprEvalSuccessObj(IfcTimeStampValue.of(input.getValue()));
    } else if (input instanceof IfcDateTimeValue) {
      return new ExprEvalSuccessObj(input.toIfcTimeStampValue());
    }
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_TIME_STAMP;
  }
}
