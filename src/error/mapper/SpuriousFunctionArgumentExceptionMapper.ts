import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import {
  ExprEvalError,
  ExprEvalMissingFunctionArgumentErrorObj,
  ExprEvalSpuriousFunctionArgumentErrorObj,
  ExprEvalValidationError,
} from "../../expression/ExprEvalResult.js";
import { MissingFunctionArgumentException } from "../MissingFunctionArgumentException.js";
import { TextSpan } from "../../util/TextSpan.js";
import { SpuriousFunctionArgumentException } from "../SpuriousFunctionArgumentException";

export class SpuriousFunctionArgumentExceptionMapper
  implements ExceptionToExprEvalErrorMapper<SpuriousFunctionArgumentException>
{
  mapException(exception: SpuriousFunctionArgumentException): ExprEvalError {
    return new ExprEvalSpuriousFunctionArgumentErrorObj(
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
