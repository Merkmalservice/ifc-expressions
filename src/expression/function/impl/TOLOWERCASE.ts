import {Func} from "../Func.js";
import {FuncArgString} from "../arg/FuncArgString.js";
import {ExpressionValue} from "../../../value/ExpressionValue.js";
import {ExprEvalResult, ExprEvalSuccessObj,} from "../../ExprEvalResult.js";
import {StringValue} from "../../../value/StringValue.js";
import {ExprType} from "../../../type/ExprType.js";
import {Type} from "../../../type/Types.js";
import {FunctionExpr} from "../FunctionExpr.js";

export class TOLOWERCASE extends Func {
  constructor() {
    super("TOLOWERCASE", [new FuncArgString(true, "object")]);
  }
  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    return new ExprEvalSuccessObj(
      StringValue.of((evaluatedArguments.get("object") as StringValue).getValue().toLowerCase())
    );
  }

  public getReturnType(argumentTypes: ExprType[]): ExprType {
    throw Type.STRING;
  }
}
