import { ExpressionValue } from "../../value/ExpressionValue.js";
import { IfcExpressionFunctionConfigException } from "../../error/IfcExpressionFunctionConfigException.js";
import { isNullish } from "../../util/IfcExpressionUtils.js";
import { FuncArg } from "./FuncArg.js";
import {
  ExprEvalError,
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
import { ParserRuleContext } from "antlr4ng";
import { FunctionExpr } from "./FunctionExpr.js";
import { Expr } from "../Expr.js";
import { SpuriousFunctionArgumentException } from "../../error/SpuriousFunctionArgumentException.js";
import { LocalizedText } from "../../documentation/Documentation.js";

export abstract class Func {
  protected name: string;
  protected formalArguments: Array<FuncArg<unknown>>;
  protected documentationRef?: LocalizedText;

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

  public withDocumentation(documentation: LocalizedText): this {
    this.documentationRef = documentation;
    return this;
  }

  public getDocumentation(): LocalizedText | undefined {
    return this.documentationRef;
  }

  public getFormalArguments(): ReadonlyArray<FuncArg<unknown>> {
    return this.formalArguments;
  }

  public getSignatureLabel(displayName = this.name): string {
    const preferredArguments = this.formalArguments.filter(
      (argument) => argument.displayLabel !== undefined
    );
    const signatureArguments =
      preferredArguments.length > 0
        ? preferredArguments
        : this.formalArguments.filter((argument) => argument.required);
    const labels = signatureArguments.map(
      (argument) => argument.displayLabel?.fallback ?? argument.name
    );
    return `${displayName}(${labels.join(", ")})`;
  }

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
      if (numProvided > this.formalArguments.length) {
        throw new SpuriousFunctionArgumentException(
          this.name,
          "[unexpected argument]",
          this.formalArguments.length,
          ctx,
          `Function expects (at most) ${this.formalArguments.length} arguments`
        );
      }
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

  protected abstract calculateResult(
    callingExpr: FunctionExpr,
    evaluatedArguments: Map<string, ExpressionValue>
  ): ExprEvalResult<ExpressionValue>;

  protected transformArguments(
    callingExpr: Expr<any>,
    evaluatedArguments: Map<string, ExprEvalResult<ExpressionValue>>
  ): void {}

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
    this.transformArguments(callingExpr, result);
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
