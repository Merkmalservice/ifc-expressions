import { ParserRuleContext } from "antlr4";
import { ValidationException } from "./ValidationException.js";

export class MissingFunctionArgumentException extends ValidationException {
  readonly functionName: string;
  readonly argumentName: string;
  readonly index: number;

  constructor(functionName: string, argumentName: string, index:number, ctx) {
    super(`Required argument ${argumentName} of function ${functionName} (at 0-based index ${index}) is missing.`, ctx);
    this.functionName = functionName;
    this.argumentName = argumentName;
    this.index = index;
  }
}
