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
import { IF } from "./impl/IF";

const builtinFunctions = new Map<string, Func>();
function registerFunc(func: Func) {
  builtinFunctions.set(
    IfcExpressionFunctions.normalizeName(func.getName()),
    func
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
registerFunc(new EXISTS());
registerFunc(new FuncBooleanBinary("AND", (left, right) => left && right));
registerFunc(new FuncBooleanBinary("OR", (left, right) => left || right));
registerFunc(
  new FuncBooleanBinary("XOR", (left, right) => (left ? !right : right))
);
registerFunc(new FuncBooleanBinary("IMPLIES", (left, right) => !left || right));
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
