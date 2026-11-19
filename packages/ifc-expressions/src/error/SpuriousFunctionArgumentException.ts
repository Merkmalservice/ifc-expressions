import { FunctionArgumentException } from "./FunctionArgumentException.js";
import { isNullish } from "../util/IfcExpressionUtils.js";

export class SpuriousFunctionArgumentException extends FunctionArgumentException {
  constructor(
    functionName: string,
    argumentName: string,
    index: number,
    ctx,
    message?: string
  ) {
    super(
      isNullish(message) ? "Spurious function argument" : message,
      functionName,
      argumentName,
      index,
      ctx
    );
  }
}
