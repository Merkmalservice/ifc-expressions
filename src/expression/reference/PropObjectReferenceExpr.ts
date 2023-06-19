import {MmsExpressionContext} from "../../context/MmsExpressionContext";
import {Expr1} from "../Expr1";
import {Expr0} from "../Expr0";
import {ObjectReferenceExpr} from "./ObjectReferenceExpr";
import {ObjectAccessor} from "../../context/accessor/ObjectAccessor";

export class PropObjectReferenceExpr extends Expr0<ObjectAccessor> implements ObjectReferenceExpr{

    constructor() {
        super();
    }

    evaluate(ctx: MmsExpressionContext ): ObjectAccessor {
        return ctx.resolvePropRef();
    }

}