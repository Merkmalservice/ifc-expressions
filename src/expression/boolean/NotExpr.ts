import {BooleanValue} from "../../value/BooleanValue";
import {Expr1} from "../Expr1";
import {Expr} from "../Expr";
import {ExprKind} from "../ExprKind";
import {ExprEvalError} from "../ExprEvalResult";
import {IfcExpressionContext} from "../../context/IfcExpressionContext";

export class NotExpr extends Expr1<BooleanValue, BooleanValue> {

    constructor (value: Expr<BooleanValue>) {
        super(ExprKind.BOOLEAN_NOT, value);
    }

    protected calculateResult(ctx: IfcExpressionContext, localCtx: Map<string, any>, subExpressionResult: BooleanValue): ExprEvalError | BooleanValue {
        return BooleanValue.of(! subExpressionResult.getValue());
    }

    toExprString(): string {
        return `!${this.value}`;
    }

}