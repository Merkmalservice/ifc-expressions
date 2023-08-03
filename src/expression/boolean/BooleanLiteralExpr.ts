import {LiteralExpr} from "../LiteralExpr";
import {BooleanValue} from "../../value/BooleanValue";
import {ExprKind} from "../ExprKind";
import {ExprEvalError} from "../ExprEvalResult";
import {IfcExpressionContext} from "../../context/IfcExpressionContext";

export class BooleanLiteralExpr extends LiteralExpr<boolean, BooleanValue> {

    constructor(value: boolean) {
        super(ExprKind.BOOLEAN_LITERAL, value);
    }

    protected calculateResult(ctx: IfcExpressionContext): ExprEvalError | BooleanValue {
        return BooleanValue.of(this.value);
    }

    toExprString(): string {
        return this.value === true ? "TRUE" : "FALSE";
    }


}