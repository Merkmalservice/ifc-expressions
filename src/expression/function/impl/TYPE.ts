import { Func } from "../Func.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationObjectNotFoundErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ObjectAccessorValue } from "../../../value/ObjectAccessorValue.js";
import { ExprKind } from "../../ExprKind.js";
import { FuncArgObjectAccessor } from "../arg/FuncArgObjectAccessor.js";
import { isNullish } from "../../../IfcExpressionUtils.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";

export class TYPE extends Func {
  static readonly KEY_OBJECT_REF = "objectRef";

  constructor() {
    super("TYPE", [
      new FuncArgObjectAccessor(
        true,
        TYPE.KEY_OBJECT_REF,
        Type.IFC_ELEMENT_REF
      ),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_TYPE_OBJECT_REF;
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const objectRef = evaluatedArguments.get(TYPE.KEY_OBJECT_REF).getValue();
    const accessorFun = objectRef["getIfcTypeObjectAccessor"];
    if (typeof accessorFun === "function") {
      const resultingObjectAccessor = accessorFun();
      if (isNullish(resultingObjectAccessor)) {
        return new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
          ExprKind.FUNCTION,
          ExprEvalStatus.IFC_TYPE_OBJECT_NOT_FOUND,
          `No type object found`,
          this.getName(),
          "[Type of IFC element]"
        );
      } else {
        return new ExprEvalSuccessObj(
          ObjectAccessorValue.of(resultingObjectAccessor)
        );
      }
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Cannot evaluate function ${this.getName()} on the specified object`,
      objectRef
    );
  }
}
