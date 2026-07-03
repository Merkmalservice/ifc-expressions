const fs = require("fs");
const path = "src\\expression\\function\\IfcExpressionFunctions.ts";
const content = `import { Func } from "./Func.js";
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
import { TONUMERIC } from "./impl/TONUMERIC.js";
import { IfcExpressionFunctionConfigException } from "../../error/IfcExpressionFunctionConfigException.js";
import { TOBOOLEAN } from "./impl/TOBOOLEAN.js";
import { TOLOGICAL } from "./impl/TOLOGICAL.js";
import { TOLOWERCASE } from "./impl/TOLOWERCASE.js";
import { TOUPPERCASE } from "./impl/TOUPPERCASE.js";
import { SUBSTRING } from "./impl/SUBSTRING.js";
import { SPLIT } from "./impl/SPLIT.js";
import { AT } from "./impl/AT.js";
import { TOIFCDATE } from "./impl/TOIFCDATE.js";
import { TOIFCDATETIME } from "./impl/TOIFCDATETIME.js";
import { TOIFCTIME } from "./impl/TOIFCTIME.js";
import { TOIFCDURATION } from "./impl/TOIFCDURATION.js";
import { TOIFCTIMESTAMP } from "./impl/TOIFCTIMESTAMP.js";
import { ADDDURATION } from "./impl/ADDDURATION.js";

const builtinFunctions = new Map<string, Func>();

type BuiltinArgumentDoc = {
  label: string;
  documentation: string;
};

function registerOrDie(fnKey: string, func: Func) {
  if (builtinFunctions.has(fnKey)) {
    throw new IfcExpressionFunctionConfigException(
      cannot register function with name '").slice(0,0);
  }
}
`;
fs.writeFileSync(path, content);
