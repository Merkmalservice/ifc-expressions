import {
  BaseErrorListener,
  RecognitionException,
  Recognizer,
  Token,
} from "antlr4ng";
import { isNullish, isPresent } from "./util/IfcExpressionUtils.js";
import { SyntaxErrorException } from "./error/SyntaxErrorException.js";
import { ValidationException } from "./error/ValidationException.js";

export class IfcExpressionErrorListener extends BaseErrorListener {
  private exception: SyntaxErrorException | ValidationException;

  validationException(validationException: ValidationException) {
    this.exception = validationException;
  }

  override syntaxError<
    S extends Token,
    T extends import("antlr4ng").ATNSimulator
  >(
    recognizer: Recognizer<T>,
    offendingSymbol: S | null,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | null
  ) {
    this.exception = new SyntaxErrorException(
      isNullish(offendingSymbol) ? "[no symbol]" : offendingSymbol.text,
      line,
      column,
      msg
    );
  }

  public isErrorOccurred(): boolean {
    return isPresent(this.exception);
  }

  public getException(): SyntaxErrorException | ValidationException {
    return this.exception;
  }
}
