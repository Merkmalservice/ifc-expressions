import { FuncArg } from "../FuncArg.js";
import { FunctionExpr } from "../FunctionExpr.js";
import {
  ExprEvalResult,
  ExprEvalTypeErrorObj,
  isExprEvalSuccess,
} from "../../ExprEvalResult.js";
import { ExpressionValue } from "../../../value/ExpressionValue.js";
import { ExprKind } from "../../ExprKind.js";
import { isNullish } from "../../../IfcExpression.js";
import { ExprType } from "../../../type/ExprType.js";
import { Types } from "../../../type/Types.js";

type UnpackConstructor<T> = T extends new (boolean, string) => FuncArg<infer U>
  ? U
  : never;

export class FuncArgUnion<T> extends FuncArg<T> {
  private readonly options: Array<FuncArg<T>>;

  constructor(...options: FuncArg<T>[]) {
    super(options[0].required, options[0].name, options[0].defaultValue);
    this.options = options;
  }

  public static of<T extends new (boolean, string) => FuncArg<any>>(
    required: boolean,
    name: string,
    constructors: T[]
  ): FuncArgUnion<UnpackConstructor<T>> {
    return new FuncArgUnion<UnpackConstructor<T>>(
      ...constructors.map((c) => new c(required, name))
    );
  }

  transformValue(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalResult<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
    const successResults = this.options
      .map((o) => o.transformValue(callingExpr, invocationValue))
      .filter((r) => !isNullish(r))
      .filter((r) => isExprEvalSuccess(r));
    if (successResults.length === 0) {
      return new ExprEvalTypeErrorObj(
        ExprKind.FUNCTION_ARGUMENTS,
        `Argument ${this.name} is must be one of ${this.options}. The provided value, '${invocationValue}' is not allowed. `,
        callingExpr.getTextSpan()
      );
    }
    return successResults[0];
  }

  getType(): ExprType {
    return Types.or(...this.options.map((o) => o.getType()));
  }
}
