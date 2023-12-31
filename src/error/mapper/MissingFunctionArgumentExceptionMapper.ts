import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalError,
  ExprEvalMissingFunctionArgumentErrorObj,
} from "../../expression/ExprEvalResult.js";
import { MissingFunctionArgumentException } from "../MissingFunctionArgumentException.js";
import { TextSpan } from "../../util/TextSpan.js";

export class MissingFunctionArgumentExceptionMapper
  implements ExceptionToExprEvalErrorMapper<MissingFunctionArgumentException>
{
  mapException(exception: MissingFunctionArgumentException): ExprEvalError {
    return new ExprEvalMissingFunctionArgumentErrorObj(
      exception.message,
      exception.functionName,
      exception.argumentName,
      exception.index,
      TextSpan.of(
        exception.fromLine,
        exception.fromColumn + 1,
        exception.toLine,
        exception.toColumn + 1
      )
    );
  }
}
