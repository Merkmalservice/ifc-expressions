import { Func } from "../Func.js";
import { FuncArg } from "../FuncArg.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalMissingRequiredFunctionArgumentErrorObj,
  ExprEvalResult,
  ExprEvalSuccessObj,
} from "../../ExprEvalResult.js";
import { ObjectAccessor } from "../../../context/ObjectAccessor.js";
import { ExprKind } from "../../ExprKind.js";
import { ObjectAccessorValue } from "../../../value/ObjectAccessorValue.js";
import {Type} from "../../../parse/Types";

export class AttributeAccessorFunction extends Func {
  private readonly attributeName;
  static readonly KEY_OBJECT_REF = "objectRef";
  private returnType: Type;

  constructor(attributeName: string, returnType: Type) {
    super(attributeName.toUpperCase(), [
      new FuncArg<string>(true, AttributeAccessorFunction.KEY_OBJECT_REF),
    ]);
    this.attributeName = attributeName;
    this.returnType = returnType;
  }


  getReturnType(): Type {
    return this.returnType;
  }

  protected calculateResult(
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const objectRef = evaluatedArguments
      .get(AttributeAccessorFunction.KEY_OBJECT_REF)
      .getValue();
    return new ExprEvalSuccessObj(
      (objectRef as ObjectAccessor).getAttribute(this.attributeName)
    );
  }
}
