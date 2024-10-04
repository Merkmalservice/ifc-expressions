import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { FuncArgIfcTimeString } from "../arg/FuncArgIfcTimeString.js";
import { IfcTimeValue } from "../../../value/IfcTimeValue.js";
import { FuncArgUnion } from "../arg/FuncArgUnion.js";
import { FuncArgIfcDateTime } from "../arg/FuncArgIfcDateTime.js";

export class TOIFCTIME extends Func {
  constructor() {
    super("TOIFCTIME", [
      FuncArgUnion.of(true, "time", [FuncArgIfcTimeString, FuncArgIfcDateTime]),
    ]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const input = evaluatedArguments.get("time");
    if (input instanceof StringValue) {
      return new ExprEvalSuccessObj(IfcTimeValue.of(input.getValue()));
    } else if (input instanceof IfcDateTimeValue) {
      return new ExprEvalSuccessObj(input.toIfcTimeValue());
    }
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_TIME;
  }
}
