import {Expr} from "./Expr";
import {IfcExpressionContext} from "../context/IfcExpressionContext";

export abstract class Expr0<E> implements Expr<E>{

    protected constructor() {
    }

    abstract evaluate(ctx: IfcExpressionContext): E;
}