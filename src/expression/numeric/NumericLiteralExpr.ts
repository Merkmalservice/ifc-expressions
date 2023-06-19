import {Expr1} from "../Expr1";
import {MmsExpressionContext} from "../../context/MmsExpressionContext";
import {NumericValue} from "../../context/value/NumericValue";

export class NumericLiteralExpr extends Expr1<NumericValue, NumericValue> {

    constructor(value: NumericValue) {
        super(value);
    }

    evaluate(ctx: MmsExpressionContext): NumericValue {
        return this.value;
    }

}