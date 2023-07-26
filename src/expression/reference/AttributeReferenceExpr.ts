import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { Expr2 } from "../Expr2.js";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { ObjectAccessor } from "../../context/ObjectAccessor.js";
import { ExprKind } from "../ExprKind.js";
import {
  ExprEvalError,
  ExprEvalError2Obj,
  ExprEvalRefChainErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  isExprEvalRefChainError,
  isExprEvalSuccess,
} from "../ExprEvalResult.js";
import { Expr } from "../Expr.js";
import { LocalContextKeys } from "../LocalContextKeys.js";

export class AttributeReferenceExpr extends Expr2<
  ObjectAccessor,
  LiteralValueAnyArity,
  LiteralValueAnyArity
> {
  constructor(left: Expr<ObjectAccessor>, right: Expr<LiteralValueAnyArity>) {
    super(ExprKind.REF_ATTRIBUTE, left, right);
  }

  protected onAfterLeftRecursion(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: ObjectAccessor
  ) {
    localCtx.set(LocalContextKeys.OBJECT_ACCESSOR, leftResult);
  }

  calculateResult(
    ctx: IfcExpressionContext,
    localCtx,
    objectAccessor: ObjectAccessor,
    dereferencedValue: LiteralValueAnyArity
  ): LiteralValueAnyArity | ExprEvalError {
    localCtx.delete(LocalContextKeys.OBJECT_ACCESSOR);
    return dereferencedValue;
  }

  protected makeResultForRightSubExprError(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>,
    leftResult: ExprEvalResult<ObjectAccessor>,
    rightResult: ExprEvalError
  ): ExprEvalResult<LiteralValueAnyArity> {
    if (isExprEvalSuccess(leftResult) && isExprEvalRefChainError(rightResult)) {
      return ExprEvalRefChainErrorObj.bubbleUp(
        rightResult,
        this.left.getKind()
      );
    }
    return super.makeResultForRightSubExprError(
      ctx,
      localCtx,
      leftResult,
      rightResult
    );
  }

  protected handleError(
    error: any,
    leftResult: ExprEvalResult<ObjectAccessor>,
    rightResult: ExprEvalResult<LiteralValueAnyArity>
  ): ExprEvalError {
    return new ExprEvalError2Obj(
      this.getKind(),
      leftResult,
      rightResult,
      ExprEvalStatus.REFERENCE_ERROR,
      ["Unable to resolve attribute reference:", error]
    );
  }
}
