import {MmsExpressionContext} from "../../context/MmsExpressionContext";
import {ObjectReferenceExpr} from "./ObjectReferenceExpr";
import {ObjectAccessor} from "../../context/accessor/ObjectAccessor";
import {Expr0} from "../Expr0";

export class ElemObjectReferenceExpr extends Expr0<ObjectAccessor> implements ObjectReferenceExpr {

    constructor() {
        super();
    }

    evaluate(ctx: MmsExpressionContext ): ObjectAccessor {
        return ctx.resolveElemRef();
    }


}