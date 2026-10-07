import { Func } from "../Func.js";
import { FuncArg } from "../FuncArg.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
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
import { isNullish } from "../../../util/IfcExpressionUtils.js";
import { Type, Types } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class PROPERTY extends Func {
  static readonly KEY_OBJECT_REF = "objectRef";
  static readonly KEY_PROPERTY_NAME = "propertyName";

  constructor() {
    super("PROPERTY", [
      new FuncArgObjectAccessor(
        true,
        PROPERTY.KEY_OBJECT_REF,
        Types.or(
          Type.IFC_ELEMENT_REF,
          Type.IFC_PROPERTY_SET_REF,
          Type.IFC_TYPE_OBJECT_REF
        )
      ),
      new FuncArg<string>(false, PROPERTY.KEY_PROPERTY_NAME),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_PROPERTY_REF;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
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
          1,
          callingExpr.getTextSpan()
        );
      }
      if (!StringValue.isStringValueType(propertyNameVal)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Property name must be a string",
          propertyNameVal,
          callingExpr.getTextSpan()
        );
      }
      const propertyName: string = propertyNameVal.stringValue;
      const resultingObjectAccessor = accessorFun.call(objectRef, propertyName);
      if (isNullish(resultingObjectAccessor)) {
        return new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
          ExprKind.FUNCTION,
          ExprEvalStatus.IFC_PROPERTY_NOT_FOUND,
          `No ifc property found with name '${propertyName}'`,
          this.getName(),
          propertyName,
          callingExpr.getTextSpan()
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
      objectRef,
      callingExpr.getTextSpan()
    );
  }
}
