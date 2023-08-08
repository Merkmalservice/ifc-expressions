import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalUnknownFunctionErrorObj,
  ExprEvalValidationError,
} from "../../expression/ExprEvalResult.js";
import { NoSuchFunctionException } from "../NoSuchFunctionException.js";
import { NoSuchMethodException } from "../NoSuchMethodException.js";

export class NoSuchFunctionExceptionMapper
  implements
    ExceptionToExprEvalErrorMapper<
      NoSuchFunctionException | NoSuchMethodException
    >
{
  mapException(
    exception: NoSuchFunctionException | NoSuchMethodException
  ): ExprEvalValidationError {
    const name =
      exception instanceof NoSuchFunctionException
        ? exception.functionName
        : exception.methodName;
    return new ExprEvalUnknownFunctionErrorObj(
      exception.message,
      exception.fromLine,
      exception.fromColumn,
      name,
      exception.toLine,
      exception.toColumn
    );
  }
}
