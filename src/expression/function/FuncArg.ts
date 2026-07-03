import { ExpressionValue } from "../../value/ExpressionValue.js";
import { ExprEvalResult } from "../ExprEvalResult.js";
import { isNullish } from "../../util/IfcExpressionUtils.js";
import { Type } from "../../type/Types.js";
import { ExprType } from "../../type/ExprType.js";
import { FunctionExpr } from "./FunctionExpr.js";
import { LocalizedText } from "../../documentation/Documentation.js";

export class FuncArg<T> {
  protected _required: boolean;
  protected _name: string;
  protected _defaultValue?: T;
  protected _displayLabel?: LocalizedText;
  protected _documentation?: LocalizedText;

  constructor(required: boolean, name: string, defaultValue?: T) {
    this._required = required;
    this._name = name;
    this._defaultValue = defaultValue;
  }

  public getType(): ExprType {
    return Type.ANY;
  }

  public withDocumentation(
    displayLabel: LocalizedText,
    documentation: LocalizedText
  ): this {
    this._displayLabel = displayLabel;
    this._documentation = documentation;
    return this;
  }

  public transformValue(
    callingExpr: FunctionExpr,
    invocationValue: ExprEvalResult<ExpressionValue>
  ): ExprEvalResult<ExpressionValue> {
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

  get displayLabel(): LocalizedText | undefined {
    return this._displayLabel;
  }

  get documentation(): LocalizedText | undefined {
    return this._documentation;
  }

  hasDefaultValue(): boolean {
    return !isNullish(this._defaultValue);
  }
}
