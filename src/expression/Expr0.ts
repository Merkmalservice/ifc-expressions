import {Expr} from "./Expr";
import {MmsExpressionContext} from "../context/MmsExpressionContext";

export abstract class Expr0<E> implements Expr<E>{

    protected constructor() {
    }

    abstract evaluate(ctx: MmsExpressionContext): E;
}