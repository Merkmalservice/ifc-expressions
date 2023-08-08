import { ErrorListener, RecognitionException, Recognizer, Token } from "antlr4";
import { isNullish, isPresent } from "./IfcExpressionUtils.js";
import { SyntaxErrorException } from "./error/SyntaxErrorException.js";
import { ValidationException } from "./error/ValidationException.js";

export class IfcExpressionErrorListener extends ErrorListener<Token | number> {
  private exception: SyntaxErrorException | ValidationException;

  validationException(validationException: ValidationException) {
    this.exception = validationException;
  }

  syntaxError(
    recognizer: Recognizer<Token | number>,
    offendingSymbol: Token | number,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | undefined
  ) {
    if (typeof offendingSymbol === "number") {
      this.exception = new SyntaxErrorException(
        offendingSymbol,
        line,
        column,
        msg
      );
    } else {
      this.exception = new SyntaxErrorException(
        isNullish(offendingSymbol) ? "[no symbol]" : offendingSymbol.text,
        line,
        column,
        msg
      );
    }
  }

  public isErrorOccurred(): boolean {
    return isPresent(this.exception);
  }

  public getException(): SyntaxErrorException | ValidationException {
    return this.exception;
  }
}
