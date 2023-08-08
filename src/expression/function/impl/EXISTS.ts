import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  isExprEvalError,
} from "../../ExprEvalResult.js";
import { Type } from "../../../type/Types.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { FuncArgObjectAccessor } from "../arg/FuncArgObjectAccessor.js";
import { ExprType } from "../../../type/ExprType.js";

export class EXISTS extends Func {
  private static readonly KEY_OBJECT = "object";

  constructor() {
    super("EXISTS", [
      new FuncArgObjectAccessor(true, EXISTS.KEY_OBJECT, Type.IFC_OBJECT_REF),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.BOOLEAN;
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    return undefined; // does not get called
  }

  evaluate(
    funcArgs: Array<ExprEvalResult<ExpressionValue>>
  ): ExprEvalResult<ExpressionValue> {
    const args = this.getArgumentValues(funcArgs);
    if (isExprEvalError(args)) {
      return args;
    }
    const arg = args.get(EXISTS.KEY_OBJECT);
    if (isExprEvalError(arg)) {
      if (
        arg.status === ExprEvalStatus.NOT_FOUND ||
        arg.status === ExprEvalStatus.IFC_PROPERTY_NOT_FOUND ||
        arg.status === ExprEvalStatus.IFC_TYPE_OBJECT_NOT_FOUND ||
        arg.status === ExprEvalStatus.IFC_PROPERTY_SET_NOT_FOUND
      ) {
        return new ExprEvalSuccessObj(BooleanValue.of(false));
      } else {
        return arg;
      }
    }
    return new ExprEvalSuccessObj(BooleanValue.of(true));
  }
}
