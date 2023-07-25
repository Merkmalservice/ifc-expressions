import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity";
import { ExprEvalResult } from "../ExprEvalResult";
import { isNullish } from "../../IfcExpressionUtils";

export class FuncArg<T> {
  protected _required: boolean;
  protected _name: string;
  protected _defaultValue?: T;

  constructor(required: boolean, name: string, defaultValue?: T) {
    this._required = required;
    this._name = name;
    this._defaultValue = defaultValue;
  }

  /**
   * For the value provided for a specific invocation of the function, return an appropriate result (maybe some kind of type conversion or type check might happen here)
   *
   * @param invocationValue
   */
  public transformValue(
    invocationValue: ExprEvalResult<LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity> {
    return invocationValue;
  }

  get required(): boolean {
    return this._required;
  }

  get name(): string {
    return this._name;
  }

  get defaultValue(): T | undefined {
    return this._defaultValue;
  }

  hasDefaultValue(): boolean {
    return !isNullish(this._defaultValue);
  }
}
