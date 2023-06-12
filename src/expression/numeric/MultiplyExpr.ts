import {Expr2} from "../Expr2";
import {Expr} from "../Expr";
import Decimal from "decimal.js";

export class MultiplyExpr extends Expr2<Expr<Decimal>, Expr<Decimal>, Decimal> {
    constructor(left: Expr<Decimal>, right: Expr<Decimal>) {
        super(left,right);
    }

    evaluate(): Decimal {
        return this.left.evaluate().mul(this.right.evaluate());
    }

}