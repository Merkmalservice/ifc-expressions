import {
  BuiltinVariableRegistry,
  IfcExpressionAutocomplete,
} from "../src/IfcExpression.js";
import { IfcExpressionFunctions } from "../src/expression/function/IfcExpressionFunctions.js";
import { Type } from "../src/type/Types.js";

const payloadRegistry = new BuiltinVariableRegistry([
  {
    name: "$payload",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "code",
        kind: "property",
        valueType: Type.STRING,
      },
    ],
  },
]);

const defaultDefinitions = BuiltinVariableRegistry.getDefaultRegistry()
  .getDefinitions()
  .map((definition) => ({
    name: definition.name,
    type: definition.type,
    members: [...definition.members.values()],
    createReferenceExpr: definition.createReferenceExpr,
  }));

const registry = new BuiltinVariableRegistry([
  ...defaultDefinitions,
  {
    name: "$query",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "property",
        kind: "property",
        valueType: Type.STRING,
      },
      {
        name: "matches",
        kind: "function",
        returnType: Type.BOOLEAN,
        argumentTypes: [Type.STRING],
      },
    ],
  },
  {
    name: "$result",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "statusCode",
        kind: "property",
        valueType: Type.NUMERIC,
      },
      {
        name: "payload",
        kind: "property",
        valueType: payloadRegistry.getDefinition("payload")!.type,
      },
      {
        name: "payloadFn",
        kind: "function",
        returnType: payloadRegistry.getDefinition("payload")!.type,
        argumentTypes: [],
      },
      {
        name: "payloadByCode",
        kind: "function",
        returnType: payloadRegistry.getDefinition("payload")!.type,
        argumentTypes: [Type.STRING],
      },
    ],
  },
]);

type CompletionCase = {
  text: string;
  expected: Array<string> | null;
};

type BuiltinFunctionCoverageCase = CompletionCase & {
  functionName: string;
};

function complete(textWithCursorMarker: string) {
  const cursor = textWithCursorMarker.indexOf("|");
  const text =
    cursor === -1
      ? textWithCursorMarker
      : `${textWithCursorMarker.slice(0, cursor)}${textWithCursorMarker.slice(cursor + 1)}`;

  return IfcExpressionAutocomplete.complete(text, cursor === -1 ? text.length : cursor, {
    builtinVariableRegistry: registry,
  });
}

function completeLabels(textWithCursorMarker: string) {
  return complete(textWithCursorMarker).items.map((item) => item.label);
}

const propertyMemberLabels = [
  "description",
  "ifcClass",
  "name",
  "propertySet",
  "value",
];

const propertySetMemberLabels = ["description", "guid", "name", "property"];

const elementMemberLabels = [
  "description",
  "guid",
  "ifcClass",
  "name",
  "property",
  "propertySet",
  "type",
];

const typeObjectMemberLabels = [
  "description",
  "guid",
  "name",
  "property",
  "propertySet",
];

const completionCases: Array<CompletionCase> = [
  {
    text: "$",
    expected: ["$element", "$property", "$query", "$result"],
  },
  {
    text: "$e",
    expected: ["$element"],
  },
  {
    text: "$pr",
    expected: ["$property"],
  },
  {
    text: "$QU",
    expected: ["$query"],
  },
  {
    text: "IF($re",
    expected: ["$result"],
  },
  {
    text: "ROU",
    expected: ["ROUND"],
  },
  {
    text: "REGEXREP",
    expected: ["REGEXREPLACE"],
  },
  {
    text: "TOIFCDAT",
    expected: ["TOIFCDATE", "TOIFCDATETIME"],
  },
  {
    text: "ROU| + 1",
    expected: ["ROUND"],
  },
  {
    text: "$result.st| + 1",
    expected: ["statusCode"],
  },
  {
    text: "$query.mat|('x')",
    expected: ["matches"],
  },
  {
    text: "$query.",
    expected: ["matches", "property"],
  },
  {
    text: "$query.m",
    expected: ["matches"],
  },
  {
    text: "$query.p",
    expected: ["property"],
  },
  {
    text: "$result.",
    expected: ["payload", "payloadByCode", "payloadFn", "statusCode"],
  },
  {
    text: "$result.pa",
    expected: ["payload", "payloadByCode", "payloadFn"],
  },
  {
    text: "$RESULT.ST",
    expected: ["statusCode"],
  },
  {
    text: "$result.payload.",
    expected: ["code"],
  },
  {
    text: "$result.payload.c",
    expected: ["code"],
  },
  {
    text: "$result.payloadFn().",
    expected: ["code"],
  },
  {
    text: "$result.payloadFn().c",
    expected: ["code"],
  },
  {
    text: "$result.payloadByCode('A.01').",
    expected: ["code"],
  },
  {
    text: "$result.payloadByCode('A.01').c",
    expected: ["code"],
  },
  {
    text: "$element.",
    expected: elementMemberLabels,
  },
  {
    text: "$ELEMENT.PR",
    expected: ["property", "propertySet"],
  },
  {
    text: "$element.g",
    expected: ["guid"],
  },
  {
    text: "$element.type().",
    expected: typeObjectMemberLabels,
  },
  {
    text: "$element.type().pr",
    expected: ["property", "propertySet"],
  },
  {
    text: "$element.type().property('Foo').",
    expected: null,
  },
  {
    text: "$element.type().property('Foo').v",
    expected: ["value"],
  },
  {
    text: "$element.type().propertySet('PSet_Betonbau').",
    expected: null,
  },
  {
    text: "$element.property('Bewehrungsgrad').",
    expected: propertyMemberLabels,
  },
  {
    text: "$element.property('Bewehrungsgrad').v",
    expected: ["value"],
  },
  {
    text: "$element.propertySet('PSet_Betonbau').",
    expected: propertySetMemberLabels,
  },
  {
    text: "$element.propertySet('PSet_Betonbau').pr",
    expected: ["property"],
  },
  {
    text: "$element.propertySet('PSet_Betonbau').property('Bewehrungsgrad').",
    expected: null,
  },
  {
    text: "$property.",
    expected: propertyMemberLabels,
  },
  {
    text: "$property.pr",
    expected: ["propertySet"],
  },
  {
    text: "$property.propertySet().",
    expected: propertySetMemberLabels,
  },
  {
    text: "$property.propertySet().property('Bewehrungsgrad').",
    expected: null,
  },
  {
    text: "1 + $query",
    expected: ["$query"],
  },
  {
    text: "$result.payloadByCode('A', 'B').",
    expected: null,
  },
  {
    text: "$result.unknown.",
    expected: null,
  },
  {
    text: "$element.property()",
    expected: null,
  },
  {
    text: "$element.property('Bewehrungsgrad').unknown",
    expected: null,
  },
  {
    text: "$element.propertySet('PSet_Betonbau').unknown",
    expected: null,
  },
  {
    text: "$element.type().propertySet('PSet_Betonbau').unknown",
    expected: null,
  },
];

const builtinFunctionCoverageCases: Array<BuiltinFunctionCoverageCase> = [
  { functionName: "MAP", text: "MA", expected: ["MAP", "MATCHES"] },
  { functionName: "CHOOSE", text: "CHO", expected: ["CHOOSE"] },
  { functionName: "AT", text: "A", expected: ["ADDDURATION", "AND", "AT"] },
  { functionName: "IF", text: "IF", expected: ["IF", "IFCCLASS"] },
  { functionName: "ROUND", text: "ROU", expected: ["ROUND"] },
  { functionName: "NAME", text: "NA", expected: ["NAME"] },
  { functionName: "GUID", text: "GU", expected: ["GUID"] },
  { functionName: "IFCCLASS", text: "IFC", expected: ["IFCCLASS"] },
  { functionName: "DESCRIPTION", text: "DES", expected: ["DESCRIPTION"] },
  { functionName: "VALUE", text: "VAL", expected: ["VALUE"] },
  {
    functionName: "PROPERTYSET",
    text: "PROPERTYS",
    expected: ["PROPERTYSET"],
  },
  {
    functionName: "PROPERTY",
    text: "PROPERT",
    expected: ["PROPERTY", "PROPERTYSET"],
  },
  { functionName: "TYPE", text: "TY", expected: ["TYPE"] },
  {
    functionName: "NOT",
    text: "NOT",
    expected: ["NOT", "NOTFOUNDASUNKNOWN"],
  },
  { functionName: "TOSTRING", text: "TOSTR", expected: ["TOSTRING"] },
  { functionName: "TONUMERIC", text: "TONUMER", expected: ["TONUMERIC"] },
  { functionName: "TONUMBER", text: "TONUMB", expected: ["TONUMBER"] },
  { functionName: "TOBOOLEAN", text: "TOBO", expected: ["TOBOOLEAN"] },
  { functionName: "TOLOGICAL", text: "TOLOG", expected: ["TOLOGICAL"] },
  {
    functionName: "NOTFOUNDASUNKNOWN",
    text: "NOTF",
    expected: ["NOTFOUNDASUNKNOWN"],
  },
  {
    functionName: "TOIFCDATE",
    text: "TOIFCDATE",
    expected: ["TOIFCDATE", "TOIFCDATETIME"],
  },
  {
    functionName: "TOIFCTIME",
    text: "TOIFCTIME",
    expected: ["TOIFCTIME", "TOIFCTIMESTAMP"],
  },
  {
    functionName: "TOIFCDATETIME",
    text: "TOIFCDATET",
    expected: ["TOIFCDATETIME"],
  },
  {
    functionName: "TOIFCDURATION",
    text: "TOIFCDUR",
    expected: ["TOIFCDURATION"],
  },
  {
    functionName: "TOIFCTIMESTAMP",
    text: "TOIFCTIMES",
    expected: ["TOIFCTIMESTAMP"],
  },
  {
    functionName: "ADDDURATION",
    text: "ADDD",
    expected: ["ADDDURATION"],
  },
  {
    functionName: "TOLOWERCASE",
    text: "TOLOW",
    expected: ["TOLOWERCASE"],
  },
  {
    functionName: "TOUPPERCASE",
    text: "TOUP",
    expected: ["TOUPPERCASE"],
  },
  {
    functionName: "SUBSTRING",
    text: "SUBS",
    expected: ["SUBSTRING"],
  },
  { functionName: "SPLIT", text: "SPL", expected: ["SPLIT"] },
  { functionName: "EXISTS", text: "EXI", expected: ["EXISTS"] },
  { functionName: "AND", text: "AN", expected: ["AND"] },
  { functionName: "OR", text: "OR", expected: ["OR"] },
  { functionName: "XOR", text: "XO", expected: ["XOR"] },
  { functionName: "IMPLIES", text: "IMP", expected: ["IMPLIES"] },
  { functionName: "EQUALS", text: "EQU", expected: ["EQUALS"] },
  {
    functionName: "GREATERTHAN",
    text: "GREATERTHAN",
    expected: ["GREATERTHAN", "GREATERTHANOREQUAL"],
  },
  {
    functionName: "GREATERTHANOREQUAL",
    text: "GREATERTHANO",
    expected: ["GREATERTHANOREQUAL"],
  },
  {
    functionName: "LESSTHAN",
    text: "LESSTHAN",
    expected: ["LESSTHAN", "LESSTHANOREQUAL"],
  },
  {
    functionName: "LESSTHANOREQUAL",
    text: "LESSTHANO",
    expected: ["LESSTHANOREQUAL"],
  },
  { functionName: "CONTAINS", text: "CONT", expected: ["CONTAINS"] },
  { functionName: "MATCHES", text: "MAT", expected: ["MATCHES"] },
  {
    functionName: "REGEXCONTAINS",
    text: "REGEXC",
    expected: ["REGEXCONTAINS"],
  },
  {
    functionName: "REGEXMATCHES",
    text: "REGEXM",
    expected: ["REGEXMATCHES"],
  },
  { functionName: "REPLACE", text: "REP", expected: ["REPLACE"] },
  {
    functionName: "REGEXREPLACE",
    text: "REGEXR",
    expected: ["REGEXREPLACE"],
  },
];

describe("IfcExpressionAutocomplete", () => {
  describe.each(completionCases)("complete('$text')", ({ text, expected }) => {
    it(
      `returns ${expected === null ? "no suggestions" : "the expected suggestions"}`,
      () => {
        expect(completeLabels(text)).toEqual(expected ?? []);
      }
    );
  });

  describe.each(builtinFunctionCoverageCases)(
    "builtin function coverage for $functionName",
    ({ functionName, text, expected }) => {
      it("uses a real builtin function name", () => {
        expect(IfcExpressionFunctions.isBuiltinFunction(functionName)).toBe(true);
      });

      it(
        `completes '${text}' to ${expected === null ? "nothing" : JSON.stringify(expected)}`,
        () => {
          expect(completeLabels(text)).toEqual(expected ?? []);
        }
      );
    }
  );

  it("keeps builtin root metadata plain", () => {
    const result = complete("$");

    expect(result.items.every((item) => item.kind === "builtinRoot")).toBe(true);
    expect(result.items.every((item) => item.insertText === undefined)).toBe(true);
    expect(result.items.every((item) => item.argumentTypeNames === undefined)).toBe(
      true
    );
    expect(result.items.every((item) => item.returnTypeName === undefined)).toBe(
      true
    );
    expect(result.items.every((item) => item.chainable === undefined)).toBe(true);
    expect(result.items.every((item) => item.cursorOffset === undefined)).toBe(true);
    expect(result.replaceFrom).toBe(0);
    expect(result.replaceTo).toBe(1);
  });

  it("keeps builtin member metadata typed", () => {
    const result = complete("$result.");

    expect(result.items).toEqual(
      expect.arrayContaining([
        {
          kind: "builtinMemberFunction",
          label: "payloadFn",
          insertText: "payloadFn()",
          cursorOffset: 10,
          argumentTypeNames: [],
          returnTypeName: "payload",
          chainable: true,
        },
        {
          kind: "builtinMemberProperty",
          label: "payload",
          returnTypeName: "payload",
          chainable: true,
        },
      ])
    );
    expect(result.replaceFrom).toBe(8);
    expect(result.replaceTo).toBe(8);
  });
});

