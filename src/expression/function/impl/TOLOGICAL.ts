import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  isExprEvalError,
} from "../../ExprEvalResult.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { LogicalValue } from "../../../value/LogicalValue.js";
import { FuncArgBoolean } from "../arg/FuncArgBoolean.js";
import { Expr } from "../../Expr.js";

export class TOLOGICAL extends Func {
  private static readonly KEY_OBJECT = "object";
  constructor() {
    super("TOLOGICAL", [new FuncArgBoolean(true, "object")]);
  }

  protected transformArguments(
    callingExpr: Expr<any>,
    evaluatedArguments: Map<string, ExprEvalResult<ExpressionValue>>
  ) {
    const val = evaluatedArguments.get(TOLOGICAL.KEY_OBJECT);
    if (isExprEvalError(val)) {
      if (val.status === ExprEvalStatus.IFC_PROPERTY_NOT_FOUND) {
        evaluatedArguments.set(
          TOLOGICAL.KEY_OBJECT,
          new ExprEvalSuccessObj(LogicalValue.unknown())
        );
      }
    } else {
      evaluatedArguments.set(
        TOLOGICAL.KEY_OBJECT,
        new ExprEvalSuccessObj(
          LogicalValue.of(val.result.getValue() as boolean)
        )
      );
    }
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const val = evaluatedArguments.get(TOLOGICAL.KEY_OBJECT);
    try {
      return new ExprEvalSuccessObj(val);
    } catch (e) {
      return new ExprEvalFunctionEvaluationErrorObj(
        callingExpr.getKind(),
        ExprEvalStatus.ERROR,
        `Cannot convert ${val.getValue()} to boolean: ${e.message}`,
        this.name,
        callingExpr.getTextSpan()
      );
    }
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.LOGICAL;
  }
}
