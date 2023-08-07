import {ComparisonOp} from "./ComparisonOp";
import {ExpressionValue} from "../../value/ExpressionValue";
import {Comparable} from "../../value/Comparable";
import {Expr} from "../Expr";
import {ExprKind} from "../ExprKind";

export class GreaterThan<T extends ExpressionValue & Comparable<T>> extends ComparisonOp<T> {

    constructor(left: Expr<T>, right: Expr<T>) {
        super(ExprKind.CMP_GREATER_THAN, left, right, num => num > 0);
    }
}