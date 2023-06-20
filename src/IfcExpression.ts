
import {CharStream, CommonTokenStream, ErrorListener, Token} from 'antlr4';
import {Visitor} from "./Visitor";
import {IfcErrorListener} from "./IfcErrorListener";
import {notNullish} from "./utils";
import {IfcExpressionContext} from "./context/IfcExpressionContext";
import {LiteralValueAnyArity} from "./context/value/LiteralValueAnyArity";
import {Expr} from "./expression/Expr";
import IfcExpressionParser, {ExprContext} from "../generated/parser/IfcExpressionParser";
import IfcExpressionLexer from "../generated/parser/IfcExpressionLexer";

export class IfcExpression {
    public static parse(input:string, errorListener?: ErrorListener<Token>): ExprContext {
        const chars = new CharStream(input); // replace this with a FileStream as required
        const lexer = new IfcExpressionLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new IfcExpressionParser(tokens);
        if (notNullish(errorListener)) {
            parser.removeErrorListeners();
            parser.addErrorListener(errorListener);
        }
        return parser.expr();
    }

    public static evaluate(expression: string, context: IfcExpressionContext): LiteralValueAnyArity {
        const errorListener = new IfcErrorListener();
        const tree:ExprContext = IfcExpression.parse(expression, errorListener);
        if (errorListener.isErrorOccurred()) {
            throw errorListener.getException();
        }
        const parsedExpression = this.extractExprTree(tree);
        return parsedExpression.evaluate(context);
    }

    private static extractExprTree(tree: ExprContext): Expr<any> {
        const visitor = new Visitor();
        const parsedExpression = visitor.visit(tree);
        return parsedExpression;
    }
}
