import {ExpressionValue} from "../../value/ExpressionValue";
import {Expr2} from "../Expr2";
import {ExprKind} from "../ExprKind";
import {Expr} from "../Expr";
import {IfcExpressionContext} from "../../context/IfcExpressionContext";
import {ExprEvalError} from "../ExprEvalResult";
import {BooleanValue} from "../../value/BooleanValue";

export class EqualsExpr extends Expr2<ExpressionValue, ExpressionValue, BooleanValue> {

    constructor(left: Expr<ExpressionValue>, right: Expr<ExpressionValue>) {
        super(ExprKind.CMP_EQUALS, left, right);
    }

    protected calculateResult(ctx: IfcExpressionContext, localCtx: Map<string, any>, leftOperand: ExpressionValue, rightOperand: ExpressionValue): ExprEvalError | BooleanValue {
        return new BooleanValue(leftOperand.equals(rightOperand));
    }

    toExprString(): string {
        return `${this.left.toExprString()} == ${this.right.toExprString()}`;
    }

}