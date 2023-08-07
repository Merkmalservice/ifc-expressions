import {ExpressionValue} from "../../value/ExpressionValue";
import {Expr2} from "../Expr2";
import {ExprKind} from "../ExprKind";
import {Expr} from "../Expr";
import {IfcExpressionContext} from "../../context/IfcExpressionContext";
import {ExprEvalError} from "../ExprEvalResult";
import {Comparable} from "../../value/Comparable";
import {BooleanValue} from "../../value/BooleanValue";

export class ComparisonOp<T extends ExpressionValue & Comparable<T>> extends Expr2<T, T, BooleanValue>{

    private readonly comparisonFunction: (number) => boolean;

    constructor(exprKind: ExprKind, left: Expr<T>, right: Expr<T>, cmp: (number) => boolean) {
        super(exprKind, left, right);
        this.comparisonFunction = cmp;
    }

    toExprString(): string {
        return `${this.left.toExprString()} > ${this.right.toExprString}`;
    }

    protected calculateResult(ctx: IfcExpressionContext, localCtx: Map<string, any>, leftOperand: T, rightOperand: T): ExprEvalError | BooleanValue {
        return BooleanValue.of(this.comparisonFunction(leftOperand.compareTo(rightOperand)));
    }

}