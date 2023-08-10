import { Func } from "../Func.js";
import { FuncArg } from "../FuncArg.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprEvalResult, ExprEvalSuccessObj } from "../../ExprEvalResult.js";
import { ObjectAccessor } from "../../../context/ObjectAccessor.js";
import { ExprType } from "../../../type/ExprType.js";
import { FunctionExpr } from "../FunctionExpr.js";
import { ParserRuleContext } from "antlr4";

export class AttributeAccessorFunction extends Func {
  private readonly attributeName;
  static readonly KEY_OBJECT_REF = "objectRef";
  private readonly returnType: ExprType;

  constructor(attributeName: string, returnType: ExprType) {
    super(attributeName.toUpperCase(), [
      new FuncArg<string>(true, AttributeAccessorFunction.KEY_OBJECT_REF),
    ]);
    this.attributeName = attributeName;
    this.returnType = returnType;
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return this.returnType;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
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
