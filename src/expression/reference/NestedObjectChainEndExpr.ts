import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { ExprKind } from "../ExprKind";
import {
  ExprEvalError,
  ExprEvalErrorObj,
  ExprEvalRefChainErrorObj,
  ExprEvalStatus,
} from "../ExprEvalResult";
import { isNullish } from "../../IfcExpressionUtils";
import { Expr0 } from "../Expr0";
import { LocalContextKeys } from "../LocalContextKeys";
import { ObjectAccessor } from "../../context/ObjectAccessor";

export class NestedObjectChainEndExpr extends Expr0<LiteralValueAnyArity> {
  private readonly attributeName: string;
  constructor(value: string) {
    super(ExprKind.REF_NESTED_OBJECT_CHAIN_END);
    this.attributeName = value;
  }

  protected doEvaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalError | LiteralValueAnyArity {
    const objectAccessor: ObjectAccessor = localCtx.get(
      LocalContextKeys.OBJECT_ACCESSOR
    );
    if (isNullish(objectAccessor)) {
      return new ExprEvalErrorObj(
        this.getKind(),
        ExprEvalStatus.MISSING_OPERAND,
        `No ObjectAccessor found in localContext when trying to access attribute with name'${this.attributeName}`
      );
    }
    const attributeValue = objectAccessor.getAttribute(this.attributeName);
    if (isNullish(attributeValue)) {
      return new ExprEvalRefChainErrorObj(
        this.getKind(),
        ExprEvalStatus.REFERENCE_ERROR,
        this.attributeName,
        `No such nested object: '${this.attributeName}'`
      );
    }
    localCtx.delete(LocalContextKeys.OBJECT_ACCESSOR);
    return attributeValue;
  }
}
