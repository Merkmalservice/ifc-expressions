import { Func } from "../Func.js";
import { FuncArg } from "../FuncArg.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalFunctionEvaluationObjectNotFoundErrorObj,
  ExprEvalMissingRequiredFunctionArgumentErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  ExprEvalSuccessObj,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ObjectAccessorValue } from "../../../value/ObjectAccessorValue.js";
import { ExprKind } from "../../ExprKind.js";
import { FuncArgObjectAccessor } from "../arg/FuncArgObjectAccessor.js";
import { StringValue } from "../../../value/StringValue.js";
import { isNullish } from "../../../IfcExpressionUtils.js";

export class PROPERTY extends Func {
  static readonly KEY_OBJECT_REF = "objectRef";
  static readonly KEY_PROPERTY_NAME = "propertyName";

  constructor() {
    super("PROPERTY", [
      new FuncArgObjectAccessor(true, PROPERTY.KEY_OBJECT_REF),
      new FuncArg<string>(false, PROPERTY.KEY_PROPERTY_NAME),
    ]);
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const objectRef = evaluatedArguments
      .get(PROPERTY.KEY_OBJECT_REF)
      .getValue();
    const accessorFun = objectRef["getIfcPropertyAccessor"];
    if (typeof accessorFun === "function") {
      const propertyNameVal = evaluatedArguments.get(
        PROPERTY.KEY_PROPERTY_NAME
      );
      if (typeof propertyNameVal === undefined) {
        return new ExprEvalMissingRequiredFunctionArgumentErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Cannot access property: no name specified",
          this.getName(),
          PROPERTY.KEY_PROPERTY_NAME,
          1
        );
      }
      if (!StringValue.isStringValueType(propertyNameVal)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Property name must be a string",
          propertyNameVal
        );
      }
      const propertyName: string = propertyNameVal.stringValue;
      const resultingObjectAccessor = accessorFun(propertyName);
      if (isNullish(resultingObjectAccessor)) {
        return new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
          ExprKind.FUNCTION,
          ExprEvalStatus.IFC_PROPERTY_NOT_FOUND,
          `No ifc property found with name '${propertyName}'`,
          this.getName(),
          propertyName
        );
      } else {
        return new ExprEvalSuccessObj(
          ObjectAccessorValue.of(resultingObjectAccessor)
        );
      }
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      "Cannot evaluate function 'property' on the specified object",
      objectRef
    );
  }
}
