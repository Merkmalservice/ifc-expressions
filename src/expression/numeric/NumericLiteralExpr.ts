import {Expr1} from "../Expr1";
import Decimal from "decimal.js";

export class NumericLiteralExpr extends Expr1<Decimal, Decimal> {

    constructor(value: Decimal) {
        super(value);
    }

    evaluate(): Decimal {
        return this.value;
    }

}