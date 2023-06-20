import {ErrorListener, RecognitionException, Recognizer, Token} from "antlr4";
import {notNullish} from "./utils";
import {SyntaxErrorException} from "./SyntaxErrorException";


export class IfcErrorListener extends ErrorListener<Token> {
    private exception: SyntaxErrorException = null;

    syntaxError(recognizer: Recognizer<Token>, offendingSymbol: Token, line: number, column: number, msg: string, e: RecognitionException | undefined) {
        this.exception = new SyntaxErrorException(offendingSymbol, line, column, msg);
    }


    public isErrorOccurred(): boolean {
        return notNullish(this.exception);
    }

    public getException(): SyntaxErrorException {
        return this.exception;
    }
}