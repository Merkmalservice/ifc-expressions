import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalValidationError,
  ExprEvalWrongFunctionArgumentTypeErrorObj,
} from "../../expression/ExprEvalResult.js";
import { WrongFunctionArgumentTypeException } from "../WrongFunctionArgumentTypeException.js";
import { TextSpan } from "../../util/TextSpan";

export class WrongFunctionArgumentTypeExceptionMapper
  implements ExceptionToExprEvalErrorMapper<WrongFunctionArgumentTypeException>
{
  mapException(
    exception: WrongFunctionArgumentTypeException
  ): ExprEvalValidationError {
    return new ExprEvalWrongFunctionArgumentTypeErrorObj(
      exception.message,
      exception.functionName,
      exception.argumentName,
      exception.argumentIndex,
      exception.expectedType.getName(),
      exception.actualType.getName(),
      TextSpan.of(
        exception.fromLine,
        exception.fromColumn + 1,
        exception.toLine,
        exception.toColumn
      )
    );
  }
}
