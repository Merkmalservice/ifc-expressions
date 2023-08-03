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
import { ObjectAccessor } from "../../../context/ObjectAccessor.js";
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
import { isNullish } from "../../../IfcExpressionUtils.js";
import { IfcPropertySetAccessor } from "../../../context/IfcPropertySetAccessor.js";

export class PROPERTYSET extends Func {
  static readonly KEY_OBJECT_REF = "objectRef";
  static readonly KEY_PSET_NAME = "pset_name";

  constructor() {
    super("PROPERTYSET", [
      new FuncArgObjectAccessor(true, PROPERTYSET.KEY_OBJECT_REF),
      new FuncArg<string>(false, PROPERTYSET.KEY_PSET_NAME),
    ]);
  }

  protected calculateResult(
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
          1
        );
      }
      if (!StringValue.isStringValueType(psetNameVal)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Property set name must be a string",
          psetNameVal
        );
      }
      const psetName: string = psetNameVal.stringValue;
      const resultingObjectAccessor =
        objectRef.getIfcPropertySetAccessor(psetName);
      return this.makeResult(resultingObjectAccessor, psetName);
    } else if (isIfcPropertyAccessor(objectRef)) {
      return this.makeResult(
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
          1
        );
      }
      if (!StringValue.isStringValueType(psetNameVal)) {
        return new ExprEvalTypeErrorObj(
          ExprKind.FUNCTION_ARGUMENTS,
          "Property set name must be a string",
          psetNameVal
        );
      }
      const psetName: string = psetNameVal.stringValue;
      return this.makeResult(
        objectRef.getIfcPropertySetAccessor(psetName),
        psetName
      );
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      "Cannot evaluate function 'propertySet' on the specified object",
      objectRef
    );
  }

  private makeResult(
    resultingObjectAccessor: IfcPropertySetAccessor,
    psetName: string
  ) {
    if (isNullish(resultingObjectAccessor)) {
      return new ExprEvalFunctionEvaluationObjectNotFoundErrorObj(
        ExprKind.FUNCTION,
        ExprEvalStatus.IFC_PROPERTY_SET_NOT_FOUND,
        `No ifc property set found with name '${psetName}'`,
        this.getName(),
        psetName
      );
    } else {
      return new ExprEvalSuccessObj(
        ObjectAccessorValue.of(resultingObjectAccessor)
      );
    }
  }
}
