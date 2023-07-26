import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import { ExprEvalError, isExprEvalSuccess } from "../ExprEvalResult.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { Expr0 } from "../Expr0.js";
import { LiteralValue } from "../../value/LiteralValue.js";
import { Func } from "./Func.js";
import { IfcExpressionFunctions } from "./IfcExpressionFunctions.js";
import { isNullish } from "../../IfcExpressionUtils.js";

export class FunctionExpr extends Expr0<LiteralValueAnyArity> {
  private name: string;
  private elements: Array<Expr<LiteralValue>>;
  private functionImplementation: Func;

  constructor(name: string, elements: Array<Expr<LiteralValue>>) {
    super(ExprKind.ARRAY);
    this.name = name;
    this.elements = elements;
    this.functionImplementation = IfcExpressionFunctions.getFunction(this.name);
    if (isNullish(this.functionImplementation)) {
      throw new Error(`No such function: ${this.name}`);
    }
  }

  protected doEvaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalError | LiteralValueAnyArity {
    const functionArguments = [];
    for (let i = 0; i < this.elements.length; i++) {
      const evalResult = this.elements[i].evaluate(ctx, localCtx);
      functionArguments.push(evalResult);
    }
    const evaluationResult = IfcExpressionFunctions.applyFunction(
      this.name,
      functionArguments
    );
    if (isExprEvalSuccess(evaluationResult)) {
      return evaluationResult.result;
    }
    return evaluationResult;
  }
}
