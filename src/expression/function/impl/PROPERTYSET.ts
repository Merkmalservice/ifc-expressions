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
import { isIfcElementAccessor } from "../../../context/IfcElementAccessor.js";
import { StringValue } from "../../../value/StringValue.js";
import {
  IfcPropertyAccessor,
  isIfcPropertyAccessor,
} from "../../../context/IfcPropertyAccessor.js";
import { isIfcTypeObjectAccessor } from "../../../context/IfcTypeObjectAccessor.js";
import { isNullish } from "../../../util/IfcExpressionUtils.js";
import { IfcPropertySetAccessor } from "../../../context/IfcPropertySetAccessor.js";
import { Type, Types } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class PROPERTYSET extends Func {
  static readonly KEY_OBJECT_REF = "objectRef";
  static readonly KEY_PSET_NAME = "pset_name";

  constructor() {
    super("PROPERTYSET", [
      new FuncArgObjectAccessor(
        true,
        PROPERTYSET.KEY_OBJECT_REF,
        Types.or(
          Type.IFC_ELEMENT_REF,
          Type.IFC_PROPERTY_REF,
          Type.IFC_TYPE_OBJECT_REF
        )
      ),
      new FuncArg<string>(false, PROPERTYSET.KEY_PSET_NAME),
    ]);
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.IFC_PROPERTY_SET_REF;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const objectRef = evaluatedArguments
      .get(PROPERTYSET.KEY_OBJECT_REF)
      .getValue();
    if (isIfcElementAccessor(objectRef)) {
      const psetNameVal = evaluatedArguments.get(PROPERTYSET.KEY_PSET_NAME);
      if (typeof psetNameVal === undefined) {
        return new ExprEvalMissingRequiredFunctionArgumentErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Name is required to access a property set of an IFC element",
          this.getName(),
          PROPERTYSET.KEY_PSET_NAME,
          1,
          callingExpr.getTextSpan()
        );
      }
      if (!StringValue.isStringValueType(psetNameVal)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Property set name must be a string",
          psetNameVal,
          callingExpr.getTextSpan()
        );
      }
      const psetName: string = psetNameVal.stringValue;
      const resultingObjectAccessor =
        objectRef.getIfcPropertySetAccessor(psetName);
      return this.makeResult(callingExpr, resultingObjectAccessor, psetName);
    } else if (isIfcPropertyAccessor(objectRef)) {
      return this.makeResult(
        callingExpr,
        (objectRef as IfcPropertyAccessor).getIfcPropertySetAccessor(),
        "[PropertySet of Property]"
      );
    } else if (isIfcTypeObjectAccessor(objectRef)) {
      const psetNameVal = evaluatedArguments.get(PROPERTYSET.KEY_PSET_NAME);
      if (typeof psetNameVal === undefined) {
        return new ExprEvalMissingRequiredFunctionArgumentErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Name is required to access a property set of an IFC type object",
          this.getName(),
          PROPERTYSET.KEY_PSET_NAME,
          1,
          callingExpr.getTextSpan()
        );
      }
      if (!StringValue.isStringValueType(psetNameVal)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Property set name must be a string",
          psetNameVal,
          callingExpr.getTextSpan()
        );
      }
      const psetName: string = psetNameVal.stringValue;
      return this.makeResult(
        callingExpr,
        objectRef.getIfcPropertySetAccessor(psetName),
        psetName
      );
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      "Cannot evaluate function 'propertySet' on the specified object",
      objectRef,
      callingExpr.getTextSpan()
    );
  }

  private makeResult(
    callingExpr: FunctionExpr,
    resultingObjectAccessor: IfcPropertySetAccessor,
    psetName: string
  ) {
    if (isNullish(resultingObjectAccessor)) {
      return new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
        ExprKind.FUNCTION,
        ExprEvalStatus.IFC_PROPERTY_SET_NOT_FOUND,
        `No ifc property set found with name '${psetName}'`,
        this.getName(),
        psetName,
        callingExpr.getTextSpan()
      );
    } else {
      return new ExprEvalSuccessObj(
        ObjectAccessorValue.of(resultingObjectAccessor)
      );
    }
  }
}
