import { ExpressionValue } from "../../value/ExpressionValue.js";
import { IfcExpressionContext } from "../../context/IfcExpressionContext.js";
import {
  ExprEvalError,
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
  isExprEvalSuccess,
} from "../ExprEvalResult.js";
import { Expr } from "../Expr.js";
import { ExprKind } from "../ExprKind.js";
import { Expr0 } from "../Expr0.js";
import { Func } from "./Func.js";
import { IfcExpressionFunctions } from "./IfcExpressionFunctions.js";
import { isNullish } from "../../util/IfcExpressionUtils.js";
import { ExprType } from "../../type/ExprType.js";
import { ExprStringBuilder } from "../ExprStringBuilder.js";

export class FunctionExpr extends Expr0<ExpressionValue> {
  private readonly name: string;
  private arguments: Array<Expr<ExpressionValue>>;
  private readonly functionImplementation: Func;

  constructor(name: string, functionArguments: Array<Expr<ExpressionValue>>) {
    super(ExprKind.FUNCTION);
    this.name = name;
    this.arguments = functionArguments;
    this.functionImplementation = IfcExpressionFunctions.getFunction(this.name);
    if (isNullish(this.functionImplementation)) {
      throw new Error(`No such function: ${this.name}`);
    }
  }

  getChildren(): Array<Expr<any>> {
    return [...this.arguments];
  }

  protected doEvaluate(
    ctx: IfcExpressionContext,
    localCtx: Map<string, any>
  ): ExprEvalError | ExpressionValue {
    const functionArguments = [];
    for (let i = 0; i < this.arguments.length; i++) {
      const evalResult = this.arguments[i].evaluate(ctx, localCtx);
      functionArguments.push(evalResult);
    }
    const evaluationResult = this.applyFunction(this.name, functionArguments);
    if (isExprEvalSuccess(evaluationResult)) {
      return evaluationResult.result;
    }
    return evaluationResult;
  }

  private applyFunction(
    name: string,
    functionArgs: Array<ExprEvalResult<ExpressionValue>>
  ): ExprEvalResult<ExpressionValue> {
    const func = IfcExpressionFunctions.getFunction(name);
    if (isNullish(func)) {
      return new ExprEvalFunctionEvaluationErrorObj(
        ExprKind.FUNCTION,
        ExprEvalStatus.UNKNOWN_FUNCTION,
        `No such function ${IfcExpressionFunctions.normalizeName(name)}`,
        name,
        this.getTextSpan()
      );
    }
    return func.evaluate(this, functionArgs);
  }

  protected buildExprString(builder: ExprStringBuilder) {
    builder
      .appendString(this.functionImplementation.getName())
      .appendString("(")
      .appendExprArray(this.arguments)
      .appendString(")");
  }

  getType(): ExprType {
    return this.functionImplementation.getReturnType(
      this.arguments.map((f) => f.getType())
    );
  }
}
