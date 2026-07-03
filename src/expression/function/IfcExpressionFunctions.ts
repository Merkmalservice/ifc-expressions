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
      `cannot register function with name '${fnKey}': name already in use`
    );
  }
  builtinFunctions.set(fnKey, func);
}

function toDocKey(label: string): string {
  return label.replace(/[^a-zA-Z0-9]+/g, "_");
}

function withDocumentation<T extends Func>(
  func: T,
  summary: string,
  args: Array<BuiltinArgumentDoc> = []
): T {
  func.withDocumentation({
    key: `function.${func.getName()}.summary`,
    fallback: summary,
  });

  args.forEach((argument, index) => {
    const formalArgument = func.getFormalArguments()[index];
    if (!formalArgument) {
      return;
    }

    const docKey = toDocKey(argument.label);
    formalArgument.withDocumentation(
      {
        key: `function.${func.getName()}.arg.${docKey}.label`,
        fallback: argument.label,
      },
      {
        key: `function.${func.getName()}.arg.${docKey}.summary`,
        fallback: argument.documentation,
      }
    );
  });

  return func;
}

function registerFunc(func: Func, ...aliases: Array<string>) {
  const fnKey = func.getName();
  const keys = [...aliases];
  keys.unshift(fnKey);
  keys.forEach((key) =>
    registerOrDie(IfcExpressionFunctions.normalizeName(key), func)
  );
}

function documentAttributeAccessor(name: string, summary: string): Func {
  return withDocumentation(new AttributeAccessorFunction(name, Type.STRING), summary, [
    {
      label: "object",
      documentation: "The IFC object to read from",
    },
  ]);
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

  public static getBuiltinFunctionNames(): Array<string> {
    return [...builtinFunctions.keys()].sort((left, right) =>
      left.localeCompare(right)
    );
  }
}

registerFunc(
  withDocumentation(new MAP(), "map an input value through a list of key/value mappings", [
    { label: "input", documentation: "The value to look up" },
    { label: "mappings", documentation: "The mapping table as [key, value] pairs" },
    { label: "defaultValue", documentation: "The fallback value to return when no mapping matches" },
  ])
);
registerFunc(
  withDocumentation(new CHOOSE(), "return the value from the first matching boolean case", [
    { label: "cases", documentation: "The candidate [condition, value] pairs to evaluate in order" },
    { label: "defaultValue", documentation: "The fallback value when no case evaluates to true" },
  ])
);
registerFunc(
  withDocumentation(new AT(), "return the item at the specified index from an array or tuple", [
    { label: "input", documentation: "The array or tuple to read from" },
    { label: "index", documentation: "The zero-based index to read" },
  ])
);
registerFunc(
  withDocumentation(new IF(), "choose one of two or three values based on a boolean or logical condition", [
    { label: "condition", documentation: "The condition to evaluate" },
    { label: "thenValue", documentation: "The value returned when the condition is true" },
    { label: "elseValue", documentation: "The value returned when the condition is false" },
    { label: "unknownValue", documentation: "The value returned when a logical condition is unknown" },
  ])
);
registerFunc(
  withDocumentation(new ROUND(), "round a numeric value to the requested number of decimal places", [
    { label: "input", documentation: "The numeric value to round" },
    { label: "decimals", documentation: "The number of decimal places to keep" },
  ])
);
registerFunc(documentAttributeAccessor("name", "read the name attribute from an IFC object"));
registerFunc(documentAttributeAccessor("guid", "read the global identifier from an IFC object"));
registerFunc(documentAttributeAccessor("ifcClass", "read the IFC class name from an IFC object"));
registerFunc(documentAttributeAccessor("description", "read the description attribute from an IFC object"));
registerFunc(
  withDocumentation(
    new AttributeAccessorFunction(
      "value",
      Types.or(Type.STRING, Type.NUMERIC, Type.BOOLEAN, Type.ARRAY)
    ),
    "read the value of an IFC property object",
    [{ label: "object", documentation: "The IFC property object to read from" }]
  )
);
registerFunc(
  withDocumentation(new PROPERTYSET(), "resolve a property set on an IFC object", [
    { label: "object", documentation: "The IFC object to inspect" },
    { label: "name", documentation: "The name of the property set to resolve" },
  ])
);
registerFunc(
  withDocumentation(new PROPERTY(), "resolve a property on an IFC element, type object, or property set", [
    { label: "object", documentation: "The IFC object to inspect" },
    { label: "name", documentation: "The name of the property to resolve" },
  ])
);
registerFunc(
  withDocumentation(new TYPE(), "resolve the IFC type object of an element", [
    { label: "object", documentation: "The IFC element to inspect" },
  ])
);
registerFunc(
  withDocumentation(new NOT(), "negate a boolean or logical value", [
    { label: "value", documentation: "The value to negate" },
  ])
);
registerFunc(
  withDocumentation(new TOSTRING(), "convert a value to its string representation", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new TONUMERIC(), "convert a value to a numeric representation", [
    { label: "input", documentation: "The value to convert" },
  ]),
  "TONUMBER"
);
registerFunc(
  withDocumentation(new TOBOOLEAN(), "convert a value to a boolean representation", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new TOLOGICAL(), "convert a value to a logical representation that can be true, false, or unknown", [
    { label: "input", documentation: "The value to convert" },
  ]),
  "NOTFOUNDASUNKNOWN"
);
registerFunc(
  withDocumentation(new TOIFCDATE(), "convert a value to an IFC date", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new TOIFCTIME(), "convert a value to an IFC time", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new TOIFCDATETIME(), "convert a value to an IFC date-time", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new TOIFCDURATION(), "convert a value to an IFC duration", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new TOIFCTIMESTAMP(), "convert a value to an IFC timestamp", [
    { label: "input", documentation: "The value to convert" },
  ])
);
registerFunc(
  withDocumentation(new ADDDURATION(), "add a duration to an IFC date-time or timestamp", [
    { label: "pointInTime", documentation: "The IFC date-time or timestamp to shift" },
    { label: "duration", documentation: "The duration to add" },
  ])
);
registerFunc(
  withDocumentation(new TOLOWERCASE(), "convert a string to lowercase", [
    { label: "input", documentation: "The string to transform" },
  ])
);
registerFunc(
  withDocumentation(new TOUPPERCASE(), "convert a string to uppercase", [
    { label: "input", documentation: "The string to transform" },
  ])
);
registerFunc(
  withDocumentation(new SUBSTRING(), "extract a substring from a string", [
    { label: "input", documentation: "The source string" },
    { label: "from", documentation: "The inclusive start index" },
    { label: "to", documentation: "The exclusive end index" },
  ])
);
registerFunc(
  withDocumentation(new SPLIT(), "split a string into an array of substrings", [
    { label: "input", documentation: "The source string" },
    { label: "separator", documentation: "The separator string to split on" },
    { label: "limit", documentation: "The maximum number of resulting items" },
  ])
);
registerFunc(
  withDocumentation(new EXISTS(), "check whether an IFC reference can be resolved", [
    { label: "object", documentation: "The IFC reference to test" },
  ])
);
registerFunc(
  withDocumentation(new FuncBooleanBinary("AND", "and"), "return true only when both inputs are true", [
    { label: "left", documentation: "The left logical operand" },
    { label: "right", documentation: "The right logical operand" },
  ])
);
registerFunc(
  withDocumentation(new FuncBooleanBinary("OR", "or"), "return true when at least one input is true", [
    { label: "left", documentation: "The left logical operand" },
    { label: "right", documentation: "The right logical operand" },
  ])
);
registerFunc(
  withDocumentation(new FuncBooleanBinary("XOR", "xor"), "return true when exactly one input is true", [
    { label: "left", documentation: "The left logical operand" },
    { label: "right", documentation: "The right logical operand" },
  ])
);
registerFunc(
  withDocumentation(new FuncBooleanBinary("IMPLIES", "implies"), "evaluate logical implication from left to right", [
    { label: "left", documentation: "The premise" },
    { label: "right", documentation: "The consequence" },
  ])
);
registerFunc(
  withDocumentation(new EQUALS(), "compare two values for equality", [
    { label: "left", documentation: "The left value to compare" },
    { label: "right", documentation: "The right value to compare" },
  ])
);
registerFunc(
  withDocumentation(new CompareMagnitudes("GREATERTHAN", (cmp) => cmp > 0), "return true when the left value is greater than the right value", [
    { label: "left", documentation: "The left value to compare" },
    { label: "right", documentation: "The right value to compare" },
  ])
);
registerFunc(
  withDocumentation(new CompareMagnitudes("GREATERTHANOREQUAL", (cmp) => cmp >= 0), "return true when the left value is greater than or equal to the right value", [
    { label: "left", documentation: "The left value to compare" },
    { label: "right", documentation: "The right value to compare" },
  ])
);
registerFunc(
  withDocumentation(new CompareMagnitudes("LESSTHAN", (cmp) => cmp < 0), "return true when the left value is less than the right value", [
    { label: "left", documentation: "The left value to compare" },
    { label: "right", documentation: "The right value to compare" },
  ])
);
registerFunc(
  withDocumentation(new CompareMagnitudes("LESSTHANOREQUAL", (cmp) => cmp <= 0), "return true when the left value is less than or equal to the right value", [
    { label: "left", documentation: "The left value to compare" },
    { label: "right", documentation: "The right value to compare" },
  ])
);
registerFunc(
  withDocumentation(new MatchesPattern("CONTAINS", true, false), "check whether the input contains a simple wildcard pattern", [
    { label: "input", documentation: "The source string" },
    { label: "pattern", documentation: "The wildcard pattern to search for" },
  ])
);
registerFunc(
  withDocumentation(new MatchesPattern("MATCHES", true, true), "check whether the input fully matches a simple wildcard pattern", [
    { label: "input", documentation: "The source string" },
    { label: "pattern", documentation: "The wildcard pattern to match" },
  ])
);
registerFunc(
  withDocumentation(new MatchesPattern("REGEXCONTAINS", false, false), "check whether the input contains a regular-expression match", [
    { label: "input", documentation: "The source string" },
    { label: "pattern", documentation: "The regular expression to search for" },
  ])
);
registerFunc(
  withDocumentation(new MatchesPattern("REGEXMATCHES", false, true), "check whether the input fully matches a regular expression", [
    { label: "input", documentation: "The source string" },
    { label: "pattern", documentation: "The regular expression to match" },
  ])
);
registerFunc(new ReplacePattern("REPLACE", true));
registerFunc(new ReplacePattern("REGEXREPLACE", false));
