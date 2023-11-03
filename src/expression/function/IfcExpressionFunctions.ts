import { Func } from "./Func.js";
import { isNullish } from "../../util/IfcExpressionUtils.js";
import { MAP } from "./impl/MAP.js";
import { ROUND } from "./impl/ROUND.js";
import { AttributeAccessorFunction } from "./impl/AttributeAccessorFunction.js";
import { PROPERTYSET } from "./impl/PROPERTYSET.js";
import { PROPERTY } from "./impl/PROPERTY.js";
import { TYPE } from "./impl/TYPE.js";
import { FuncBooleanBinary } from "./impl/FuncBooleanBinary.js";
import { NOT } from "./impl/NOT.js";
import { CHOOSE } from "./impl/CHOOSE.js";
import { MatchesPattern } from "./impl/MatchesPattern.js";
import { Type, Types } from "../../type/Types.js";
import { TOSTRING } from "./impl/TOSTRING.js";
import { EXISTS } from "./impl/EXISTS.js";
import { EQUALS } from "./impl/EQUALS.js";
import { CompareMagnitudes } from "./impl/CompareMagnitudes.js";
import { ReplacePattern } from "./impl/ReplacePattern.js";
import { IF } from "./impl/IF.js";
import { TONUMERIC } from "./impl/TONUMERIC";
import { IfcExpressionFunctionConfigException } from "../../error/IfcExpressionFunctionConfigException";
import { TOBOOLEAN } from "./impl/TOBOOLEAN";
import { TOLOGICAL } from "./impl/TOLOGICAL";
import { TOLOWERCASE } from "./impl/TOLOWERCASE";
import { TOUPPERCASE } from "./impl/TOUPPERCASE";
import { SUBSTRING } from "./impl/SUBSTRING";
import { SPLIT } from "./impl/SPLIT";
import { AT } from "./impl/AT";

const builtinFunctions = new Map<string, Func>();

function registerOrDie(fnKey: string, func: Func) {
  if (builtinFunctions.has(fnKey)) {
    throw new IfcExpressionFunctionConfigException(
      `cannot register function with name '${fnKey}': name already in use`
    );
  }
  builtinFunctions.set(fnKey, func);
}

function registerFunc(func: Func, ...aliases: Array<string>) {
  const fnKey = func.getName();
  const keys = [...aliases];
  keys.unshift(fnKey);
  keys.forEach((key) =>
    registerOrDie(IfcExpressionFunctions.normalizeName(key), func)
  );
}

export class IfcExpressionFunctions {
  public static normalizeName(name: string): string {
    if (isNullish(name)) {
      return undefined;
    }
    return name.toUpperCase();
  }

  public static isBuiltinFunction(name: string) {
    if (isNullish(name)) {
      return false;
    }
    return builtinFunctions.has(this.normalizeName(name));
  }

  public static getFunction(name: string): Func {
    if (isNullish(name)) {
      return undefined;
    }
    return builtinFunctions.get(this.normalizeName(name));
  }
}

registerFunc(new MAP());
registerFunc(new CHOOSE());
registerFunc(new AT());
registerFunc(new IF());
registerFunc(new ROUND());
registerFunc(new AttributeAccessorFunction("name", Type.STRING));
registerFunc(new AttributeAccessorFunction("guid", Type.STRING));
registerFunc(new AttributeAccessorFunction("ifcClass", Type.STRING));
registerFunc(new AttributeAccessorFunction("description", Type.STRING));
registerFunc(
  new AttributeAccessorFunction(
    "value",
    Types.or(Type.STRING, Type.NUMERIC, Type.BOOLEAN, Type.ARRAY)
  )
);
registerFunc(new PROPERTYSET());
registerFunc(new PROPERTY());
registerFunc(new TYPE());
registerFunc(new NOT());
registerFunc(new TOSTRING());
registerFunc(new TONUMERIC(), "TONUMBER");
registerFunc(new TOBOOLEAN());
registerFunc(new TOLOGICAL(), "NOTFOUNDASUNKNOWN");
registerFunc(new TOLOWERCASE());
registerFunc(new TOUPPERCASE());
registerFunc(new SUBSTRING());
registerFunc(new SPLIT());
registerFunc(new EXISTS());
registerFunc(new FuncBooleanBinary("AND", "and"));
registerFunc(new FuncBooleanBinary("OR", "or"));
registerFunc(new FuncBooleanBinary("XOR", "xor"));
registerFunc(new FuncBooleanBinary("IMPLIES", "implies"));
registerFunc(new EQUALS());
registerFunc(new CompareMagnitudes("GREATERTHAN", (cmp) => cmp > 0));
registerFunc(new CompareMagnitudes("GREATERTHANOREQUAL", (cmp) => cmp >= 0));
registerFunc(new CompareMagnitudes("LESSTHAN", (cmp) => cmp < 0));
registerFunc(new CompareMagnitudes("LESSTHANOREQUAL", (cmp) => cmp <= 0));
registerFunc(new MatchesPattern("CONTAINS", true, false));
registerFunc(new MatchesPattern("MATCHES", true, true));
registerFunc(new MatchesPattern("REGEXCONTAINS", false, false));
registerFunc(new MatchesPattern("REGEXMATCHES", false, true));
registerFunc(new ReplacePattern("REPLACE", true));
registerFunc(new ReplacePattern("REGEXREPLACE", false));
