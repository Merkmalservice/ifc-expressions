import {Expr} from "./Expr";

export abstract class Expr1<V, E> implements Expr<E>{
    readonly value: V;

    protected constructor(value: V) {
        this.value = value;
    }

    abstract evaluate(): E;
}