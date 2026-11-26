import { ValidationException } from "./ValidationException.js";

export abstract class FunctionArgumentException extends ValidationException {
  readonly functionName: string;
  readonly argumentName: string;
  readonly index: number;

  constructor(
    message: string,
    functionName: string,
    argumentName: string,
    index: number,
    ctx
  ) {
    super(
      `${message} - argument ${argumentName} of function ${functionName} (at 0-based index ${index})`,
      ctx
    );
    this.functionName = functionName;
    this.argumentName = argumentName;
    this.index = index;
  }
}
