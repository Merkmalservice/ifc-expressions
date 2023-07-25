import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { ExprKind } from "../ExprKind";
import {
  ExprEvalError,
  ExprEvalErrorObj,
  ExprEvalRefChainErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  isExprEvalRefChainError,
  mapErrorObjectToMessage,
} from "../ExprEvalResult";
import { Expr1 } from "../Expr1";
import { isNullish } from "../../IfcExpressionUtils";
import { LocalContextKeys } from "../LocalContextKeys";

export class NestedObjectChainExpr extends Expr1<
  LiteralValueAnyArity,
  LiteralValueAnyArity
> {
  private readonly literalObjectRef: string;
  constructor(literalObjectRef: string, nextLink: NestedObjectChainExpr) {
    super(ExprKind.REF_NESTED_OBJECT_CHAIN, nextLink);
    this.literalObjectRef = literalObjectRef;
  }

  protected onBeforeRecusion(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): undefined | ExprEvalError {
    const objectAccessor = localCtx.get(
      LocalContextKeys.OBJECT_ACCESSOR
    ) as ObjectAccessor;
    if (isNullish(objectAccessor)) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.MISSING_OPERAND,
        `No ObjectAccessor found in localContext when trying to access nested object with name'${this.literalObjectRef}`
      );
    }
    const nestedObjectAccessor = objectAccessor.getNestedObjectAccessor(
      this.literalObjectRef
    );
    if (isNullish(nestedObjectAccessor)) {
      return new ExprEvalRefChainErrorObj(
        this.getKind(),
        ExprEvalStatus.REFERENCE_ERROR,
        this.literalObjectRef,
        `No such nested object: '${this.literalObjectRef}'`
      );
    }
    localCtx.set(LocalContextKeys.OBJECT_ACCESSOR, nestedObjectAccessor);
  }

  calculateResult(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    result: LiteralValueAnyArity
  ): LiteralValueAnyArity | ExprEvalError {
    localCtx.delete(LocalContextKeys.OBJECT_ACCESSOR);
    return result;
  }

  protected obtainResultForSubExpressionError(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    subExpressionResult: ExprEvalError
  ): ExprEvalResult<LiteralValueAnyArity> {
    if (isExprEvalRefChainError(subExpressionResult)) {
      return ExprEvalRefChainErrorObj.bubbleUp(
        subExpressionResult,
        this.literalObjectRef
      );
    }
    return new ExprEvalRefChainErrorObj(
      this.getKind(),
      subExpressionResult.status,
      this.literalObjectRef,
      subExpressionResult.message
    );
  }

  protected handleError(
    error: any,
    subResult: ExprEvalResult<LiteralValueAnyArity>
  ): ExprEvalError {
    return new ExprEvalRefChainErrorObj(
      this.getKind(),
      ExprEvalStatus.REFERENCE_ERROR,
      this.literalObjectRef,
      mapErrorObjectToMessage(error)
    );
  }
}
