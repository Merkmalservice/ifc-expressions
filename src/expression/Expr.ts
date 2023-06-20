import {IfcExpressionContext} from "../context/IfcExpressionContext";

export interface Expr<T> {
    evaluate(ctx: IfcExpressionContext): T

}