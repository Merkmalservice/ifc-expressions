import MmsExpressionVisitor from "../generated/parser/MmsExpressionVisitor";
import {NumericLiteralExpr} from "./expression/numeric/NumericLiteralExpr";
import {
    ExprContext,
    NumAddSubContext,
    NumExprContext, NumLitContext,
    NumLiteralContext, NumMulDivContext, NumParensContext,
    StringLiteralContext
} from "../generated/parser/MmsExpressionParser";
import {Expr} from "./expression/Expr";
import {notNullish} from "./utils";
import Decimal from "decimal.js";
import {PlusExpr} from "./expression/numeric/PlusExpr";
import {MinusExpr} from "./expression/numeric/MinusExpr";
import {ParserRuleContext} from "antlr4";
import {MultiplyExpr} from "./expression/numeric/MultiplyExpr";
import {DivideExpr} from "./expression/numeric/DivideExpr";
import {NumParenthesisExpr} from "./expression/numeric/NumParenthesisExpr";

export class Visitor extends MmsExpressionVisitor<Expr<any>>{

    private head:Expr<any> = undefined;

    constructor() {
        super();
    }

    visitNumLiteral: (ctx: NumLiteralContext) => Expr<any> = ctx => {
        let val = ctx.INT();
        if (notNullish(val)){
            return new NumericLiteralExpr(new Decimal(val.symbol.text));
        }
        val = ctx.FLOAT();
        if (notNullish(val)){
            return new NumericLiteralExpr(new Decimal(val.symbol.text));
        }
        this.failNode(ctx);
    }


    visitNumAddSub: (ctx: NumAddSubContext) => Expr<any> = ctx => {
        switch (ctx._op.text) {
            case '+':
            return new PlusExpr(this.visit(ctx.getChild(0)), this.visit(ctx.getChild(2)));
            case '-':
                return new MinusExpr(this.visit(ctx.getChild(0)), this.visit(ctx.getChild(2)));
            default:
                this.failNode(ctx);
        }
    }

    visitNumMulDiv: (ctx: NumMulDivContext) => Expr<any> = ctx => {
        switch (ctx._op.text) {
            case '*':
                return new MultiplyExpr(this.visit(ctx.getChild(0)), this.visit(ctx.getChild(2)));
            case '/':
                return new DivideExpr(this.visit(ctx.getChild(0)), this.visit(ctx.getChild(2)));
            default:
                this.failNode(ctx);
        }
    }


    visitNumParens: (ctx: NumParensContext) => Expr<any> = ctx => {
        return new NumParenthesisExpr(this.visit(ctx.getChild(1)));
    };

    visitExpr: (ctx: ExprContext) => Expr<any> = ctx => {
        return this.visit(ctx.getChild(0));
    }

    visitNumLit: (ctx: NumLitContext) => Expr<any> = ctx => {
        return this.visit(ctx.getChild(0));
    }

    private failNode(ctx: ParserRuleContext) {
        throw new Error(`Cannot parse (sub)expression ${ctx.getText()}`);
    }
}