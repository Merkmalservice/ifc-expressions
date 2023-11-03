import { FunctionArgumentException } from "./FunctionArgumentException";
import { isNullish } from "../util/IfcExpressionUtils";

export class MissingFunctionArgumentException extends FunctionArgumentException {
  constructor(
    functionName: string,
    argumentName: string,
    index: number,
    ctx,
    message?: string
  ) {
    super(
      isNullish(message) ? "Required argument missing" : message,
      functionName,
      argumentName,
      index,
      ctx
    );
  }
}
