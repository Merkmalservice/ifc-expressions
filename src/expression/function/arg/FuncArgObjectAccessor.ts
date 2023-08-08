import { FuncArgBase } from "./FuncArgBase.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccess,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { ExprKind } from "../../ExprKind.js";
import { ObjectAccessorValue } from "../../../value/ObjectAccessorValue.js";
import { isObjectAccessor } from "../../../context/ObjectAccessor.js";
import { Type } from "../../../type/Types.js";
import { ExprType } from "../../../type/ExprType.js";
import { IfcExpressionFunctionConfigException } from "../../../error/IfcExpressionFunctionConfigException.js";

export class FuncArgObjectAccessor extends FuncArgBase<ObjectAccessorValue> {
  private readonly type: ExprType;
  constructor(
    required: boolean,
    name: string,
    specificType: ExprType,
    defaultValue?: ObjectAccessorValue
  ) {
    super(required, name, defaultValue);
    if (!Type.IFC_OBJECT_REF.isAssignableFrom(specificType)) {
      throw new IfcExpressionFunctionConfigException(
        `${Type.IFC_OBJECT_REF.getName()} is not assignable from provided object accessor type ${specificType.getName()}`
      );
    }
    this.type = specificType;
  }

  getType(): ExprType {
    return this.type;
  }

  protected transformForTypeCheck(
    invocationValue: ExprEvalSuccess<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const result = invocationValue.result;
    const value = result.getValue();
    if (isObjectAccessor(value)) {
      return invocationValue;
    }
    return new ExprEvalTypeErrorObj(
      ExprKind.FUNCTION_ARGUMENTS,
      `Argument ${
        this.name
      } must be an ObjectAccessor, but was ${JSON.stringify(value)}`,
      value
    );
  }
}
