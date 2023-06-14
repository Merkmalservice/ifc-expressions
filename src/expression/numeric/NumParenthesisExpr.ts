import {Expr1} from "../Expr1";
import Decimal from "decimal.js";
import {Expr} from "../Expr";

export class NumParenthesisExpr extends Expr1<Expr<Decimal>, Decimal> {

    constructor(expression: Expr<Decimal>) {
        super(expression);
    }

    evaluate(): Decimal {
        return this.value.evaluate();
    }

}