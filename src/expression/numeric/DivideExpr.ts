import {Expr2} from "../Expr2";
import {Expr} from "../Expr";
import {IfcExpressionContext} from "../../context/IfcExpressionContext";
import {NumericValue} from "../../context/value/NumericValue";

export class DivideExpr extends Expr2<Expr<NumericValue>, Expr<NumericValue>, NumericValue> {
    constructor(left: Expr<NumericValue>, right: Expr<NumericValue>) {
        super(left,right);
    }

    evaluate(ctx: IfcExpressionContext): NumericValue {
        return NumericValue.of(this.left.evaluate(ctx).getValue().dividedBy(this.right.evaluate(ctx).getValue()));
    }

}