import {MmsExpressionContext} from "../context/MmsExpressionContext";

export interface Expr<T> {
    evaluate(ctx: MmsExpressionContext): T

}