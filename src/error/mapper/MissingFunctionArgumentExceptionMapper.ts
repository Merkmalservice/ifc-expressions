import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalMissingFunctionArgumentErrorObj,
  ExprEvalValidationError,
} from "../../expression/ExprEvalResult.js";
import { MissingFunctionArgumentException } from "../MissingFunctionArgumentException.js";

export class MissingFunctionArgumentExceptionMapper
  implements ExceptionToExprEvalErrorMapper<MissingFunctionArgumentException>
{
  mapException(
    exception: MissingFunctionArgumentException
  ): ExprEvalValidationError {
    return new ExprEvalMissingFunctionArgumentErrorObj(
      exception.message,
      exception.fromLine,
      exception.fromColumn,
      exception.functionName,
      exception.argumentName,
      exception.index,
      exception.toLine,
      exception.toColumn
    );
  }
}
