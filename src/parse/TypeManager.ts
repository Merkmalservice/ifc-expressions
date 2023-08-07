import { ParserRuleContext } from "antlr4";
import {Type, Types} from "./Types";
import {ExpressionTypeError} from "../error/ExpressionTypeError";

export class TypeManager {
    private readonly types = new Map<ParserRuleContext, Type>();

    constructor() {
    }

    public setType(parserRuleContext: ParserRuleContext, type: Type){
        this.types.set(parserRuleContext, type);
    }

    public getType(parserRuleContext: ParserRuleContext): Type {
        return this.types.get(parserRuleContext);
    }

    public copyTypeFrom(ctx: ParserRuleContext, from: ParserRuleContext) {
        const theType = this.types.get(from as ParserRuleContext);
        this.types.set(ctx, theType);
    }


    public requireString(ctx: ParserRuleContext ) {
        const actualType = this.types.get(ctx as ParserRuleContext)
        Types.requireExactTypeOrUnknown(
            this.types.get(ctx as ParserRuleContext),
            Type.STRING,
            () => new ExpressionTypeError(`expected type string, actual type is ${actualType}`,  ctx));
    }

    public requireBoolean(ctx: ParserRuleContext ) {
        const actualType = this.types.get(ctx as ParserRuleContext)
        Types.requireExactTypeOrUnknown(
            this.types.get(ctx as ParserRuleContext),
            Type.BOOLEAN,
            () => new ExpressionTypeError(`expected type boolean, actual type is ${actualType}`,  ctx));
    }

    public requireNumeric(ctx: ParserRuleContext ) {
        const actualType = this.types.get(ctx as ParserRuleContext)
        Types.requireExactTypeOrUnknown(
            actualType,
            Type.NUMERIC,
            () => new ExpressionTypeError(`expected type numeric, actual type is ${actualType}`,  ctx));
    }

    public requireTypesOverlap(ctxA: ParserRuleContext, ctxB: ParserRuleContext) {
        Types.requireTypesOverlap(this.types.get(ctxA), this.types.get(ctxB), () => new ExpressionTypeError("possible types do not overlap",  ctxA))
    }

    public isTypeOrBroader(type: Type, ...ctxs: Array<ParserRuleContext>){
        return ctxs.every(ctx => Types.isTypeOrUnknown(this.types.get(ctx), type));
    }

    public isType(type: Type, ...ctxs) {
        return ctxs.every(ctx => Types.isType(this.types.get(ctx), type));
    }

    public isString(...ctxs){
        return this.isType(Type.STRING, ...ctxs);
    }

    public isBoolean(...ctxs){
        return this.isType(Type.BOOLEAN, ...ctxs);
    }

    public isNumeric(...ctxs){
        return this.isType(Type.NUMERIC, ...ctxs);
    }

}