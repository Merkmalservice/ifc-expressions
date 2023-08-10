import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalUnknownFunctionErrorObj,
  ExprEvalValidationError,
} from "../../expression/ExprEvalResult.js";
import { NoSuchFunctionException } from "../NoSuchFunctionException.js";
import { NoSuchMethodException } from "../NoSuchMethodException.js";
import { TextSpan } from "../../util/TextSpan.js";

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
      name,
      TextSpan.of(
        exception.fromLine,
        exception.fromColumn + 1,
        exception.toLine,
        exception.toColumn + 1
      )
    );
  }
}
