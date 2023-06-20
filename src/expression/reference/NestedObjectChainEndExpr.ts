import {
    MmsExpressionContext
} from "../../context/MmsExpressionContext";
import {Expr2} from "../Expr2";
import {Expr1} from "../Expr1";
import {ObjectAccessor} from "../../context/accessor/ObjectAccessor";
import {LiteralValueAnyArity} from "../../context/value/LiteralValueAnyArity";

export class NestedObjectChainEndExpr extends Expr1<string, (oa: ObjectAccessor) => LiteralValueAnyArity> {

    constructor(value: string) {
        super(value);
    }

    evaluate(ctx: MmsExpressionContext): (oa: ObjectAccessor) => LiteralValueAnyArity {
        return (oa: ObjectAccessor) => oa.getAttribute(this.value);
    }

}