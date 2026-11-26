import { ExceptionToExprEvalErrorMapper } from "../ExceptionToExprEvalErrorMapper.js";
import { SyntaxErrorException } from "../SyntaxErrorException.js";
import {
  ExprEvalError,
  ExprEvalParseErrorObj,
  ExprEvalStatus,
} from "../../expression/ExprEvalResult.js";
import { TextSpan } from "../../util/TextSpan.js";

export class SyntaxErrorMapper
  implements ExceptionToExprEvalErrorMapper<SyntaxErrorException>
{
  mapException(exception: SyntaxErrorException): ExprEvalError {
    return new ExprEvalParseErrorObj(
      ExprEvalStatus.SYNTAX_ERROR,
      exception.message,
      "" + exception.offendingSymbol,
      TextSpan.of(
        exception.line,
        exception.column + 1,
        exception.line,
        exception.column + 1
      )
    );
  }
}
