import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalValidationError,
  ExprEvalWrongFunctionArgumentTypeErrorObj,
} from "../../expression/ExprEvalResult.js";
import { WrongFunctionArgumentTypeException } from "../WrongFunctionArgumentTypeException.js";

export class WrongFunctionArgumentTypeExceptionMapper
  implements ExceptionToExprEvalErrorMapper<WrongFunctionArgumentTypeException>
{
  mapException(
    exception: WrongFunctionArgumentTypeException
  ): ExprEvalValidationError {
    return new ExprEvalWrongFunctionArgumentTypeErrorObj(
      exception.message,
      exception.fromLine,
      exception.fromColumn,
      exception.functionName,
      exception.argumentName,
      exception.argumentIndex,
      exception.expectedType.getName(),
      exception.actualType.getName(),
      exception.toLine,
      exception.toColumn
    );
  }
}
