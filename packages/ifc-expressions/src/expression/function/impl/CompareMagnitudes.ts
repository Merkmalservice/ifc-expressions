import { Func } from "../Func.js";
import { FuncArgAny } from "../arg/FuncArgAny.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import {
  ExprEvalResult,
  ExprEvalSuccessObj,
  ExprEvalTypeErrorObj,
} from "../../ExprEvalResult.js";
import { isComparable } from "../../../value/Comparable.js";
import { ExprKind } from "../../ExprKind.js";
import { BooleanValue } from "../../../value/BooleanValue.js";
import { ExprType } from "../../../type/ExprType.js";
import { Type } from "../../../type/Types.js";
import { FunctionExpr } from "../FunctionExpr.js";

export class CompareMagnitudes extends Func {
  private static readonly KEY_LEFT = "left";
  private static readonly KEY_RIGHT = "right";
  private readonly comparisonFunction: (arg: number) => boolean;

  constructor(name: string, cmp: (arg: number) => boolean) {
    super(name, [
      new FuncArgAny(true, CompareMagnitudes.KEY_LEFT),
      new FuncArgAny(true, CompareMagnitudes.KEY_RIGHT),
    ]);
    this.comparisonFunction = cmp;
  }

  protected calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const left = evaluatedArguments.get(CompareMagnitudes.KEY_LEFT);
    const right = evaluatedArguments.get(CompareMagnitudes.KEY_RIGHT);
    if (!isComparable(left)) {
      return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION,
        "Cannot compare: left value is not comparable",
        left,
        callingExpr.getTextSpan()
      );
    }
    if (!isComparable(right)) {
      return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION,
        "Cannot compare: right value is not comparable",
        right,
        callingExpr.getTextSpan()
      );
    }
    // @ts-ignore
    const cmpValue = this.comparisonFunction(left.compareTo(right));
    return new ExprEvalSuccessObj(BooleanValue.of(cmpValue));
  }

  getReturnType(argumentTypes: Array<ExprType>): ExprType {
    return Type.BOOLEAN;
  }
}
