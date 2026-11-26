import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { StringValue } from "../../../value/StringValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgIfcDateString } from "../arg/FuncArgIfcDateString.js";
import { IfcDateValue } from "../../../value/IfcDateValue.js";
import { IfcDateTimeValue } from "../../../value/IfcDateTimeValue.js";
import { FuncArgUnion } from "../arg/FuncArgUnion.js";
import { FuncArgIfcDateTime } from "../arg/FuncArgIfcDateTime.js";

export class TOIFCDATE extends Func {
  constructor() {
    super("TOIFCDATE", [
      FuncArgUnion.of(true, "date", [FuncArgIfcDateTime, FuncArgIfcDateString]),
    ]);
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const input = evaluatedArguments.get("date");
    if (input instanceof StringValue) {
      return new ExprEvalSuccessObj(IfcDateValue.of(input.getValue()));
    } else if (input instanceof IfcDateTimeValue) {
      return new ExprEvalSuccessObj(input.toIfcDateValue());
    }
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_DATE;
  }
}
