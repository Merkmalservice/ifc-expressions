import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { IfcExpressionFunctionConfigException } from "./IfcExpressionFunctionConfigException.js";
import { isNullish } from "../../IfcExpressionUtils.js";
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

export abstract class Func {
  protected name: string;
  protected formalArguments: Array<FuncArg<unknown>>;

  constructor(name: string, args: Array<FuncArg<unknown>>) {
    this.name = name;
    if (isNullish(this.name)) {
      throw new IfcExpressionFunctionConfigException(
        "Function must have a name"
      );
    }
    this.formalArguments = args;
    this.checkArgs(args);
  }

  public evaluate(
    funcArgs: Array<ExprEvalResult<LiteralValueAnyArity>>
  ): ExprEvalResult<LiteralValueAnyArity> {
    const evaluatedArguments = this.getArgumentValues(funcArgs);
    if (isExprEvalError(evaluatedArguments)) {
      return evaluatedArguments;
    }
    const argumentsReadyForUse = new Map<string, LiteralValueAnyArity>();
    for (const [argName, argValue] of evaluatedArguments.entries()) {
      if (isExprEvalError(argValue)) {
        return new ExprEvalFunctionEvaluationConsequentialErrorObj(
          ExprKind.FUNCTION,
          this.name,
          argValue
        );
      }
      argumentsReadyForUse.set(argName, argValue.result);
    }
    return this.calculateResult(argumentsReadyForUse);
  }

  /**
   * Subclasses must provide the funcation evaluation code here.
   * @param evaluatedArguments
   * @protected
   */
  protected abstract calculateResult(
    evaluatedArguments: Map<string, LiteralValueAnyArity>
  ): ExprEvalResult<LiteralValueAnyArity>;

  /**
   * Override to transform individual arguments if needed. After this step, if any of the ExprEvalResult objects in the
   * returned array is an ExprEvalError, the function evaluation fails.
   * @param evaluatedArguments
   * @protected
   */
  protected transformArguments(
    evaluatedArguments: Map<string, ExprEvalResult<LiteralValueAnyArity>>
  ): Map<string, ExprEvalResult<LiteralValueAnyArity>> {
    return evaluatedArguments;
  }

  /**
   * Gets the argument values from the list of provided arguments in the form of 'name' -> ExprEvalResult (which may contain errors).
   * Generates an error if a required value is missing.
   * @param provided
   * @protected
   */
  protected getArgumentValues(
    provided: Array<ExprEvalResult<LiteralValueAnyArity>>
  ): Map<string, ExprEvalResult<LiteralValueAnyArity>> | ExprEvalError {
    const result = new Map<string, ExprEvalResult<LiteralValueAnyArity>>();
    const numProvided = provided.length;
    if (!isNullish(this.formalArguments)) {
      let j = 0;
      for (let i = 0; i < this.formalArguments.length; i++) {
        const currentArg: FuncArg<unknown> = this.formalArguments[i];
        if (numProvided > i) {
          result.set(currentArg.name, currentArg.transformValue(provided[i]));
        } else {
          if (currentArg.hasDefaultValue()) {
            result.set(
              currentArg.name,
              new ExprEvalSuccessObj(
                currentArg.defaultValue as LiteralValueAnyArity
              )
            );
          }
          if (currentArg.required) {
            return new ExprEvalMissingRequiredFunctionArgumentErrorObj(
              ExprKind.FUNCTION_ARGUMENTS,
              `Required argument ${currentArg.name}, expected at position ${i} (starting at 0), is missing`,
              this.name,
              currentArg.name,
              i
            );
          }
        }
      }
    }
    const transformedArguments = this.transformArguments(result);
    return result;
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
