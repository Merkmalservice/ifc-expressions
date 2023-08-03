import {
  ExprEvalFunctionEvaluationErrorObj,
  ExprEvalResult,
  ExprEvalStatus,
} from "../ExprEvalResult.js";
import { ExpressionValue } from "../../value/ExpressionValue.js";
import { Func } from "./Func.js";
import { isNullish } from "../../IfcExpressionUtils.js";
import { ExprKind } from "../ExprKind.js";
import { MAP } from "./impl/MAP.js";
import { ROUND } from "./impl/ROUND.js";
import { AttributeAccessorFunction } from "./impl/AttributeAccessorFunction.js";
import { PROPERTYSET } from "./impl/PROPERTYSET.js";
import { PROPERTY } from "./impl/PROPERTY.js";
import { TYPE } from "./impl/TYPE";
import {FuncBooleanBinary} from "./impl/FuncBooleanBinary";
import {NOT} from "./impl/NOT";
import {SWITCH} from "./impl/SWITCH";
import {MatchesPattern} from "./impl/MatchesPattern";

const builtinFunctions = new Map<string, Func>();
function registerFunc(func: Func) {
  builtinFunctions.set(normalizeName(func.getName()), func);
}

function normalizeName(name: string): string {
  if (isNullish(name)) {
    return undefined;
  }
  return name.toUpperCase();
}

registerFunc(new MAP());
registerFunc(new SWITCH());
registerFunc(new ROUND());
registerFunc(new AttributeAccessorFunction("name"));
registerFunc(new AttributeAccessorFunction("guid"));
registerFunc(new AttributeAccessorFunction("ifcClass"));
registerFunc(new AttributeAccessorFunction("description"));
registerFunc(new AttributeAccessorFunction("value"));
registerFunc(new PROPERTYSET());
registerFunc(new PROPERTY());
registerFunc(new TYPE());
registerFunc(new NOT());
registerFunc(new FuncBooleanBinary("AND", (left , right) => left && right));
registerFunc(new FuncBooleanBinary("OR", (left , right) => left || right));
registerFunc(new FuncBooleanBinary("XOR", (left , right) => left ? !right : right));
registerFunc(new FuncBooleanBinary("IMPLIES", (left , right) => !left || right));

registerFunc(new MatchesPattern("CONTAINS", true, false));
registerFunc(new MatchesPattern("MATCHES", true, true));
registerFunc(new MatchesPattern("REGEXCONTAINS", false, false));
registerFunc(new MatchesPattern("REGEXMATCHES", false, true));
export class IfcExpressionFunctions {
  public static isBuiltinFunction(name: string) {
    if (isNullish(name)) {
      return false;
    }
    return builtinFunctions.has(normalizeName(name));
  }

  public static getFunction(name: string) {
    if (isNullish(name)) {
      return undefined;
    }
    return builtinFunctions.get(normalizeName(name));
  }

  public static applyFunction(
    name: string,
    functionArgs: Array<ExprEvalResult<ExpressionValue>>
  ): ExprEvalResult<ExpressionValue> {
    const func = IfcExpressionFunctions.getFunction(name);
    if (isNullish(func)) {
      return new ExprEvalFunctionEvaluationErrorObj(
        ExprKind.FUNCTION,
        ExprEvalStatus.UNKNOWN_FUNCTION,
        `No such function ${normalizeName(name)}`,
        name
      );
    }
    return func.evaluate(functionArgs);
  }
}
