import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalMissingRequiredFunctionArgumentErrorObj,
  ExprEvalResult,
  ExprEvalSpuriousFunctionArgumentErrorObj,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type, Types } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { FuncArgAny } from "../arg/FuncArgAny.js";
import { FuncArgLogicalOrBoolean } from "../arg/FuncArgLogicalOrBoolean.js";
import { ParserRuleContext } from "antlr4";
import { ExprKind } from "../../ExprKind.js";
import { SpuriousFunctionArgumentException } from "../../../error/SpuriousFunctionArgumentException.js";
import { MissingFunctionArgumentException } from "../../../error/MissingFunctionArgumentException.js";
import { Value } from "../../../value/Value.js";
import { Expr } from "../../Expr.js";
import { LogicalValue } from "../../../value/LogicalValue.js";

export class IF extends Func {
  private static readonly ARG_NAME_CONDITION = "condition";
  private static readonly ARG_NAME_THEN = "thenValue";
  private static readonly ARG_NAME_ELSE = "elseValue";
  private static readonly ARG_NAME_UNKNOWN = "unknownValue";

  constructor() {
    super("IF", [
      new FuncArgLogicalOrBoolean(true, IF.ARG_NAME_CONDITION),
      new FuncArgAny(true, IF.ARG_NAME_THEN),
      new FuncArgAny(true, IF.ARG_NAME_ELSE),
      new FuncArgAny(false, IF.ARG_NAME_UNKNOWN),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    if (argumentTypes.length == 3) {
      return Types.or(argumentTypes[1], argumentTypes[2]);
    }
    if (argumentTypes.length == 4) {
      return Types.or(argumentTypes[1], argumentTypes[2], argumentTypes[3]);
    }
    throw new Error(
      "Unexpected argument types: " + JSON.stringify(argumentTypes)
    );
  }

  protected checkArgumentTypes(
    providedArgumentTypes: Array<[ParserRuleContext, ExprType]>,
    ctx
  ) {
    super.checkArgumentTypes(providedArgumentTypes, ctx);
    //extra check: if our value to be checked is a Logical, the unknownValue must be provided
    if (providedArgumentTypes[0][1].isSameTypeAs(Type.LOGICAL)) {
      if (providedArgumentTypes.length < 4) {
        throw new MissingFunctionArgumentException(
          this.name,
          IF.ARG_NAME_UNKNOWN,
          3,
          ctx,
          `Argument ${IF.ARG_NAME_UNKNOWN} is required if the argument ${IF.ARG_NAME_CONDITION} is of type logical (i.e., can be true, false or unknown)`
        );
      }
    } else if (providedArgumentTypes[0][1].isSameTypeAs(Type.BOOLEAN)) {
      if (providedArgumentTypes.length > 3) {
        throw new SpuriousFunctionArgumentException(
          this.name,
          IF.ARG_NAME_UNKNOWN,
          3,
          providedArgumentTypes[3][0],
          `Argument ${IF.ARG_NAME_UNKNOWN} is not allowed if the argument ${IF.ARG_NAME_CONDITION} is of type boolean (i.e., can only be true or false)`
        );
      }
    }
  }

  protected transformArguments(
    callingExpr: Expr<any>,
    evaluatedArguments: Map<string, ExprEvalResult<ExpressionValue>>
  ) {
    const cond = evaluatedArguments.get(IF.ARG_NAME_CONDITION);
    if (isExprEvalSuccess(cond)) {
      if ((cond.result as Value<any>).getType().isSameTypeAs(Type.LOGICAL)) {
        if (evaluatedArguments.size < 4) {
          evaluatedArguments.set(
            IF.ARG_NAME_UNKNOWN,
            new ExprEvalMissingRequiredFunctionArgumentErrorObj(
              ExprKind.FUNCTION_ARGUMENTS,
              `Argument ${IF.ARG_NAME_UNKNOWN} is required if the argument ${IF.ARG_NAME_CONDITION} is of type logical (i.e., can be true, false or unknown)`,
              this.name,
              IF.ARG_NAME_UNKNOWN,
              3,
              callingExpr.getTextSpan()
            )
          );
        }
      } else if (cond.result.getType().isSameTypeAs(Type.BOOLEAN)) {
        if (evaluatedArguments.size > 3) {
          evaluatedArguments.set(
            IF.ARG_NAME_UNKNOWN,
            new ExprEvalSpuriousFunctionArgumentErrorObj(
              `Argument ${IF.ARG_NAME_UNKNOWN} is not allowed if the argument ${IF.ARG_NAME_CONDITION} is of type boolean (i.e., can only be true or false)`,
              this.name,
              IF.ARG_NAME_UNKNOWN,
              3,
              callingExpr.getTextSpan()
            )
          );
        }
      }
    }
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const condition = evaluatedArguments.get(IF.ARG_NAME_CONDITION) as
      | LogicalValue
      | BooleanValue;
    if (condition.isTrue()) {
      const thenValue = evaluatedArguments.get(IF.ARG_NAME_THEN);
      return new ExprEvalSuccessObj(thenValue);
    } else if (condition.isFalse()) {
      const elseValue = evaluatedArguments.get(IF.ARG_NAME_ELSE);
      return new ExprEvalSuccessObj(elseValue);
    } else if (LogicalValue.isUnknown(condition.getValue())) {
      const unknownValue = evaluatedArguments.get(IF.ARG_NAME_UNKNOWN);
      return new ExprEvalSuccessObj(unknownValue);
    }
    return new ExprEvalFunctionEvaluationErrorObj(
      ExprKind.FUNCTION,
      ExprEvalStatus.ERROR,
      "Cannot handle value of condtition: " + JSON.stringify(condition),
      this.name,
      callingExpr.getTextSpan()
    );
  }
}
