import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
} from "../ExprEvalResult";
import { LiteralValueAnyArity } from "../../value/LiteralValueAnyArity.js";
import { Func } from "./Func.js";
import { isNullish } from "../../IfcExpressionUtils";
import { ExprKind } from "../ExprKind.js";
import { MAP } from "./impl/MAP.js";
import { ROUND } from "./impl/ROUND.js";

const builtinFunctions = Object.freeze(
  new Map<string, Func>([
    ["MAP", new MAP()],
    ["ROUND", new ROUND()],
  ])
);

export class IfcExpressionFunctions {
  public static getFunction(name: string) {
    return builtinFunctions.get(name);
  }

  public static applyFunction(
    name: string,
    functionArgs: Array<ExprEvalResult<LiteralValueAnyArity>>
  ): ExprEvalResult<LiteralValueAnyArity> {
    const func = IfcExpressionFunctions.getFunction(name);
    if (isNullish(func)) {
      return new ExprEvalFunctionEvaluationErrorObj(
        ExprKind.FUNCTION,
        ExprEvalStatus.UNKNOWN_FUNCTION,
        `No such function ${name}`,
        name
      );
    }
    return func.evaluate(functionArgs);
  }
}
