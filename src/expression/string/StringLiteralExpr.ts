import {Expr1} from "../Expr1";
import {MmsExpressionContext} from "../../context/MmsExpressionContext";
import {NumericValue} from "../../context/value/NumericValue";
import {StringValue} from "../../context/value/StringValue";

export class StringLiteralExpr extends Expr1<StringValue, StringValue> {

    constructor(value: StringValue) {
        super(value);
    }


    evaluate(ctx: MmsExpressionContext): StringValue {
        return this.value;
    }
}