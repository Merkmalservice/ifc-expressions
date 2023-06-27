import { ErrorListener, RecognitionException, Recognizer, Token } from "antlr4";
import { isPresent } from "./IfcExpressionUtils.js";
import { SyntaxErrorException } from "./SyntaxErrorException.js";

export class IfcExpressionErrorListener extends ErrorListener<Token> {
  private exception: SyntaxErrorException = null;

  syntaxError(
    recognizer: Recognizer<Token>,
    offendingSymbol: Token,
    line: number,
    column: number,
    msg: string,
    e: RecognitionException | undefined
  ) {
    this.exception = new SyntaxErrorException(
      offendingSymbol,
      line,
      column,
      msg
    );
  }

  public isErrorOccurred(): boolean {
    return isPresent(this.exception);
  }

  public getException(): SyntaxErrorException {
    return this.exception;
  }
}
