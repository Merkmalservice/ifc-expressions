import { ExpressionValue } from "../../value/ExpressionValue.js";
import { IfcExpressionFunctionConfigException } from "../../error/IfcExpressionFunctionConfigException.js";
import { isNullish } from "../../util/IfcExpressionUtils.js";
import { FuncArg } from "./FuncArg.js";
import {
  ExprEvalError,
  ExprEvalFunctionEvaluationConsequentialErrorObj,
  ExprEvalMissingRequiredFunctionArgumentErrorObj,
  ExprEvalResult,
  ExprEvalSuccessObj,
  isExprEvalError,
} from "../ExprEvalResult.js";
import { ExprKind } from "../ExprKind.js";
import { Types } from "../../type/Types.js";
import { MissingFunctionArgumentException } from "../../error/MissingFunctionArgumentException.js";
import { WrongFunctionArgumentTypeException } from "../../error/WrongFunctionArgumentTypeException.js";
import { ExprType } from "../../type/ExprType.js";
import { ParserRuleContext } from "antlr4";
import { FunctionExpr } from "./FunctionExpr.js";

export abstract class Func {
  protected name: string;
  protected formalArguments: Array<FuncArg<unknown>>;

  protected constructor(name: string, args: Array<FuncArg<unknown>>) {
    this.name = name;
    if (isNullish(this.name)) {
      throw new IfcExpressionFunctionConfigException(
        "Function must have a name"
      );
    }
    this.formalArguments = args;
    this.checkArgs(args);
  }

  public abstract getReturnType(argumentTypes: Array<ExprType>): ExprType;

  public checkArgumentsAndGetReturnType(
    argumentTypes: Array<[ParserRuleContext, ExprType]>,
    ctx
  ): ExprType {
    this.checkArgumentTypes(argumentTypes, ctx);
    return this.getReturnType(argumentTypes.map((t) => t[1]));
  }

  protected checkArgumentTypes(
    providedArgumentTypes: Array<[ParserRuleContext, ExprType]>,
    ctx
  ): void {
    const numProvided = providedArgumentTypes.length;
    if (!isNullish(this.formalArguments)) {
      for (let i = 0; i < this.formalArguments.length; i++) {
        const currentArg: FuncArg<unknown> = this.formalArguments[i];
        if (numProvided > i) {
          Types.requireWeakIsAssignableFrom(
            this.formalArguments[i].getType(),
            providedArgumentTypes[i][1],
            () =>
              new WrongFunctionArgumentTypeException(
                this.name,
                this.formalArguments[i].name,
                this.formalArguments[i].getType(),
                providedArgumentTypes[i][1],
                i,
                providedArgumentTypes[i][0]
              )
          );
        } else {
          if (currentArg.hasDefaultValue()) {
            //should be fine.
          }
          if (currentArg.required) {
            throw new MissingFunctionArgumentException(
              this.name,
              currentArg.name,
              i,
              ctx
            );
          }
        }
      }
    }
  }

  public getName(): string {
    return this.name;
  }

  public evaluate(
    callingExpr: FunctionExpr,
    funcArgs: Array<ExprEvalResult<ExpressionValue>>
  ): ExprEvalResult<ExpressionValue> {
    const evaluatedArguments = this.getArgumentValues(callingExpr, funcArgs);
    if (isExprEvalError(evaluatedArguments)) {
      return evaluatedArguments;
    }
    const argumentsReadyForUse = new Map<string, ExpressionValue>();
    for (const [argName, argValue] of evaluatedArguments.entries()) {
      if (isExprEvalError(argValue)) {
        return argValue;
      }
      argumentsReadyForUse.set(argName, argValue.result);
    }
    return this.calculateResult(callingExpr, argumentsReadyForUse);
  }

  /**
   * Subclasses must provide the funcation evaluation code here.
   * @param evaluatedArguments
   * @protected
   */
  protected abstract calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue>;

  /**
   * Override to transform individual arguments if needed. After this step, if any of the ExprEvalResult objects in the
   * returned array is an ExprEvalError, the function evaluation fails.
   * @param evaluatedArguments
   * @protected
   */
  protected transformArguments(
    evaluatedArguments: Map<string, ExprEvalResult<ExpressionValue>>
  ): Map<string, ExprEvalResult<ExpressionValue>> {
    return evaluatedArguments;
  }

  /**
   * Gets the argument values from the list of provided arguments in the form of 'name' -> ExprEvalResult (which may contain errors).
   * Generates an error if a required value is missing.
   * @param provided
   * @protected
   */
  protected getArgumentValues(
    callingExpr: FunctionExpr,
    provided: Array<ExprEvalResult<ExpressionValue>>
  ): Map<string, ExprEvalResult<ExpressionValue>> | ExprEvalError {
    const result = new Map<string, ExprEvalResult<ExpressionValue>>();
    const numProvided = provided.length;
    if (!isNullish(this.formalArguments)) {
      for (let i = 0; i < this.formalArguments.length; i++) {
        const currentArg: FuncArg<unknown> = this.formalArguments[i];
        if (numProvided > i) {
          result.set(
            currentArg.name,
            currentArg.transformValue(callingExpr, provided[i])
          );
        } else {
          if (currentArg.hasDefaultValue()) {
            result.set(
              currentArg.name,
              new ExprEvalSuccessObj(currentArg.defaultValue as ExpressionValue)
            );
          }
          if (currentArg.required) {
            return new ExprEvalMissingRequiredFunctionArgumentErrorObj(
              ExprKind.FUNCTION_ARGUMENTS,
              `Required argument ${currentArg.name}, expected at position ${i} (starting at 0), is missing`,
              this.name,
              currentArg.name,
              i,
              callingExpr.getTextSpan()
            );
          }
        }
      }
    }
    const transformedArguments = this.transformArguments(result);
    return transformedArguments;
  }

  private checkArgs(args: Array<FuncArg<unknown>>): void {
    if (!Array.isArray(this.formalArguments)) {
      throw new IfcExpressionFunctionConfigException(
        "Formal function arguments is not an array"
      );
    }
    let optionalArgsReached: boolean = false;
    const names = new Set<string>();
    for (let i = 0; i < this.formalArguments.length; i++) {
      if (names.has(this.formalArguments[i].name)) {
        throw new IfcExpressionFunctionConfigException(
          `Duplicate argument name '${this.formalArguments[i].name}'.`
        );
      }
      if (optionalArgsReached) {
        if (this.formalArguments[i].required) {
          throw new IfcExpressionFunctionConfigException(
            `Optional arguments must follow required ones. Argument '${this.formalArguments[i].name}' is required but follows an optional one`
          );
        }
      } else {
        if (!this.formalArguments[i].required) {
          optionalArgsReached = true;
        }
      }
    }
  }
}
