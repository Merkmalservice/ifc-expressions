import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalStatus,
  ExprEvalValidationError,
  ExprEvalValidationErrorObj,
} from "../../expression/ExprEvalResult.js";
import { InvalidSyntaxException } from "../InvalidSyntaxException.js";
import { ValidationException } from "../ValidationException.js";
import { ExpressionTypeError } from "../ExpressionTypeError.js";

export class ValidationExceptionMapper
  implements
    ExceptionToExprEvalErrorMapper<
      InvalidSyntaxException | ValidationException | ExpressionTypeError
    >
{
  mapException(
    exception:
      | InvalidSyntaxException
      | ValidationException
      | ExpressionTypeError
  ): ExprEvalValidationError {
    let status = ExprEvalStatus.VALIDATION_ERROR;
    if (exception instanceof InvalidSyntaxException) {
      status = ExprEvalStatus.SYNTAX_ERROR;
    } else if (exception instanceof ExpressionTypeError) {
      status = ExprEvalStatus.STATIC_TYPE_ERROR;
    }
    return new ExprEvalValidationErrorObj(
      status,
      exception.message,
      exception.fromLine,
      exception.fromColumn,
      exception.toLine,
      exception.toColumn
    );
  }
}
