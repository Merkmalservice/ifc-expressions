import {Expr} from "./Expr";
import {MmsExpressionContext} from "../context/MmsExpressionContext";

export abstract class Expr1<V, E> implements Expr<E>{
    readonly value: V;

    protected constructor(value: V) {
        this.value = value;
    }

    abstract evaluate(ctx: MmsExpressionContext): E;
}