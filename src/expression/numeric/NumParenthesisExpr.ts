import {Expr1} from "../Expr1";
import {Expr} from "../Expr";
import {MmsExpressionContext} from "../../context/MmsExpressionContext";
import {NumericValue} from "../../context/value/NumericValue";

export class NumParenthesisExpr extends Expr1<Expr<NumericValue>, NumericValue> {

    constructor(expression: Expr<NumericValue>) {
        super(expression);
    }

    evaluate(ctx: MmsExpressionContext): NumericValue {
        return this.value.evaluate(ctx);
    }

}