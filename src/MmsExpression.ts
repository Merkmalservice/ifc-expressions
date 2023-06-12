
import { CharStream, CommonTokenStream }  from 'antlr4';
import MmsExpressionParser, {ExprContext} from "../generated/parser/MmsExpressionParser";
import MmsExpressionLexer from "../generated/parser/MmsExpressionLexer";
import {Visitor} from "./Visitor";

export class MmsExpression {
    private static parse(input:string): ExprContext {
        const chars = new CharStream(input); // replace this with a FileStream as required
        const lexer = new MmsExpressionLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new MmsExpressionParser(tokens);
        return parser.expr();
    }

    public static evaluate(expression: string): any {
        const tree:ExprContext = MmsExpression.parse(expression);
        const visitor = new Visitor();
        const parsedExpression = visitor.visit(tree);
        return parsedExpression.evaluate();
    }
}
