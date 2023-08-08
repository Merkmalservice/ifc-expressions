import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import { SyntaxErrorException } from "../SyntaxErrorException.js";
import {
  ExprEvalError,
  ExprEvalParseErrorObj,
  ExprEvalStatus,
} from "../../expression/ExprEvalResult.js";

export class SyntaxErrorMapper
  implements ExceptionToExprEvalErrorMapper<SyntaxErrorException>
{
  mapException(exception: SyntaxErrorException): ExprEvalError {
    return new ExprEvalParseErrorObj(
      ExprEvalStatus.SYNTAX_ERROR,
      exception.message,
      exception.line,
      exception.column,
      "" + exception.offendingSymbol
    );
  }
}
