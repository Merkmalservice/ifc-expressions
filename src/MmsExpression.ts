
import {CharStream, CommonTokenStream, ErrorListener, Token} from 'antlr4';
import MmsExpressionParser, {ExprContext} from "../generated/parser/MmsExpressionParser";
import MmsExpressionLexer from "../generated/parser/MmsExpressionLexer";
import {Visitor} from "./Visitor";
import {MmsErrorListener} from "./MmsErrorListener";
import {notNullish} from "./utils";

export class MmsExpression {
    public static parse(input:string, errorListener?: ErrorListener<Token>): ExprContext {
        const chars = new CharStream(input); // replace this with a FileStream as required
        const lexer = new MmsExpressionLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new MmsExpressionParser(tokens);
        if (notNullish(errorListener)) {
            parser.removeErrorListeners();
            parser.addErrorListener(errorListener);
        }
        return parser.expr();
    }

    public static evaluate(expression: string): any {
        const errorListener = new MmsErrorListener();
        const tree:ExprContext = MmsExpression.parse(expression, errorListener);
        if (errorListener.isErrorOccurred()) {
            throw errorListener.getException();
        }
        const visitor = new Visitor();
        const parsedExpression = visitor.visit(tree);
        return parsedExpression.evaluate();
    }
}
