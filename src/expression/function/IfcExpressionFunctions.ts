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
import {Type} from "../../parse/Types";
import {TOSTRING} from "./impl/TOSTRING";
import {EXISTS} from "./impl/EXISTS";
import {EQUALS} from "./impl/EQUALS";
import {CompareMagnitudes} from "./impl/CompareMagnitudes";
import {ReplacePattern} from "./impl/ReplacePattern";

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
registerFunc(new AttributeAccessorFunction("name", Type.STRING));
registerFunc(new AttributeAccessorFunction("guid", Type.STRING));
registerFunc(new AttributeAccessorFunction("ifcClass", Type.STRING));
registerFunc(new AttributeAccessorFunction("description", Type.STRING));
registerFunc(new AttributeAccessorFunction("value", Type.UNKNOWN));
registerFunc(new PROPERTYSET());
registerFunc(new PROPERTY());
registerFunc(new TYPE());
registerFunc(new NOT());
registerFunc(new TOSTRING());
registerFunc(new EXISTS());
registerFunc(new FuncBooleanBinary("AND", (left , right) => left && right));
registerFunc(new FuncBooleanBinary("OR", (left , right) => left || right));
registerFunc(new FuncBooleanBinary("XOR", (left , right) => left ? !right : right));
registerFunc(new FuncBooleanBinary("IMPLIES", (left , right) => !left || right));
registerFunc(new EQUALS());
registerFunc(new CompareMagnitudes("GREATERTHAN", cmp => cmp > 0 ));
registerFunc(new CompareMagnitudes("GREATERTHANOREQUAL", cmp => cmp >= 0 ));
registerFunc(new CompareMagnitudes("LESSTHAN", cmp => cmp < 0 ));
registerFunc(new CompareMagnitudes("LESSTHANOREQUAL", cmp => cmp <= 0 ));
registerFunc(new MatchesPattern("CONTAINS", true, false));
registerFunc(new MatchesPattern("MATCHES", true, true));
registerFunc(new MatchesPattern("REGEXCONTAINS", false, false));
registerFunc(new MatchesPattern("REGEXMATCHES", false, true));
registerFunc(new ReplacePattern("REPLACE", true));
registerFunc(new ReplacePattern("REGEXREPLACE", false));
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
