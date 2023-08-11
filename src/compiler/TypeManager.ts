import { ParserRuleContext } from "antlr4";
import { Type, Types } from "../type/Types.js";
import { ExpressionTypeError } from "../error/ExpressionTypeError.js";
import { ExprType } from "../type/ExprType.js";

export class TypeManager {
  private readonly types = new Map<ParserRuleContext, ExprType>();

  constructor() {}

  public setType(parserRuleContext: ParserRuleContext, type: ExprType) {
    this.types.set(parserRuleContext, type);
  }

  public getType(parserRuleContext: ParserRuleContext): ExprType {
    return this.types.get(parserRuleContext);
  }

  public copyTypeFrom(ctx: ParserRuleContext, from: ParserRuleContext) {
    const theType = this.types.get(from as ParserRuleContext);
    this.types.set(ctx, theType);
  }

  public requireString(ctx: ParserRuleContext) {
    const actualType = this.types.get(ctx as ParserRuleContext);
    Types.requireWeakIsAssignableFrom(
      Type.STRING,
      this.types.get(ctx as ParserRuleContext),
      () =>
        new ExpressionTypeError(
          `expected type string, actual type is ${actualType.getName()}`,
          ctx
        )
    );
  }

  public requireBoolean(ctx: ParserRuleContext) {
    const actualType = this.types.get(ctx as ParserRuleContext);
    Types.requireWeakIsAssignableFrom(
      Type.BOOLEAN,
      this.types.get(ctx as ParserRuleContext),
      () =>
        new ExpressionTypeError(
          `expected type boolean, actual type is ${actualType.getName()}`,
          ctx
        )
    );
  }

  public requireNumeric(ctx: ParserRuleContext) {
    const actualType = this.types.get(ctx as ParserRuleContext);
    Types.requireWeakIsAssignableFrom(
      Type.NUMERIC,
      actualType,
      () =>
        new ExpressionTypeError(
          `expected type numeric, actual type is ${actualType.getName()}`,
          ctx
        )
    );
  }

  public requireTypesOverlap(ctxA: ParserRuleContext, ctxB: ParserRuleContext) {
    Types.requireTypesOverlap(
      this.types.get(ctxA),
      this.types.get(ctxB),
      () =>
        new ExpressionTypeError(
          `Types ${this.types.get(ctxA).getName()} and ${this.types
            .get(ctxB)
            .getName()} are required to overlap but they don't.`,
          ctxA
        )
    );
  }

  public isType(type: ExprType, ...ctxs) {
    return ctxs.every((ctx) => Types.isType(this.types.get(ctx), type));
  }

  public overlapsWith(type: ExprType, ...ctxs) {
    return ctxs.every((ctx) => type.overlapsWith(this.types.get(ctx)));
  }

  public isString(...ctxs) {
    return this.isType(Type.STRING, ...ctxs);
  }

  public overlapsWithString(...ctxs) {
    return this.overlapsWith(Type.STRING, ...ctxs);
  }

  public isBoolean(...ctxs) {
    return this.isType(Type.BOOLEAN, ...ctxs);
  }

  public isLogical(...ctxs) {
    return this.isType(Type.LOGICAL, ...ctxs);
  }

  public overlapsWithBoolean(...ctxs) {
    return this.overlapsWith(Type.BOOLEAN, ...ctxs);
  }

  public overlapsWithLogical(...ctxs) {
    return this.overlapsWith(Type.LOGICAL, ...ctxs);
  }

  public isNumeric(...ctxs) {
    return this.isType(Type.NUMERIC, ...ctxs);
  }

  public overlapsWithNumeric(...ctxs) {
    return this.overlapsWith(Type.NUMERIC, ...ctxs);
  }
}
