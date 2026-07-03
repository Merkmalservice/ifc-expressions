import {
  BuiltinVariableRegistry,
  IfcExpressionAutocomplete,
} from "../src/IfcExpression.js";
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

describe("IfcExpressionAutocomplete", () => {
  it("suggests builtin roots after '$'", () => {
    const result = IfcExpressionAutocomplete.complete("$", 1, {
      builtinVariableRegistry: registry,
    });

    expect(result.items.map((item) => item.label)).toEqual(
      expect.arrayContaining(["$element", "$property", "$query", "$result"])
    );
    expect(result.items.every((item) => item.kind === "builtinRoot")).toBe(true);
    expect(result.items.every((item) => item.insertText === undefined)).toBe(true);
    expect(result.items.every((item) => item.argumentTypeNames === undefined)).toBe(
      true
    );
    expect(result.items.every((item) => item.returnTypeName === undefined)).toBe(true);
    expect(result.items.every((item) => item.chainable === undefined)).toBe(true);
    expect(result.items.every((item) => item.cursorOffset === undefined)).toBe(true);
    expect(result.replaceFrom).toBe(0);
    expect(result.replaceTo).toBe(1);
  });

  it("filters builtin roots by prefix", () => {
    const result = IfcExpressionAutocomplete.complete("$qu", 3, {
      builtinVariableRegistry: registry,
    });

    expect(result.items.map((item) => item.label)).toEqual(["$query"]);
    expect(result.replaceFrom).toBe(0);
    expect(result.replaceTo).toBe(3);
  });

  it("suggests typed builtin members after '.'", () => {
    const result = IfcExpressionAutocomplete.complete("$query.", 7, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual([
      {
        kind: "builtinMemberFunction",
        label: "matches",
        insertText: "matches()",
        cursorOffset: 8,
        argumentTypeNames: ["string"],
        returnTypeName: "boolean",
        chainable: false,
      },
      {
        kind: "builtinMemberProperty",
        label: "property",
        returnTypeName: "string",
        chainable: false,
      },
    ]);
    expect(result.replaceFrom).toBe(7);
    expect(result.replaceTo).toBe(7);
  });

  it("filters typed builtin members by prefix", () => {
    const result = IfcExpressionAutocomplete.complete("$result.st", 10, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual([
      {
        kind: "builtinMemberProperty",
        label: "statusCode",
        returnTypeName: "numeric",
        chainable: false,
      },
    ]);
    expect(result.replaceFrom).toBe(8);
    expect(result.replaceTo).toBe(10);
  });

  it("suggests chained members from nested context object types", () => {
    const result = IfcExpressionAutocomplete.complete("$result.payload.", 16, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual([
      {
        kind: "builtinMemberProperty",
        label: "code",
        returnTypeName: "string",
        chainable: false,
      },
    ]);
    expect(result.replaceFrom).toBe(16);
    expect(result.replaceTo).toBe(16);
  });

  it("suggests chained members through zero-argument function return types", () => {
    const result = IfcExpressionAutocomplete.complete("$result.payloadFn().", 20, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual([
      {
        kind: "builtinMemberProperty",
        label: "code",
        returnTypeName: "string",
        chainable: false,
      },
    ]);
    expect(result.replaceFrom).toBe(20);
    expect(result.replaceTo).toBe(20);
  });

  it("suggests chained members through argument-bearing function return types", () => {
    const result = IfcExpressionAutocomplete.complete(
      "$result.payloadByCode('A.01').",
      30,
      {
        builtinVariableRegistry: registry,
      }
    );

    expect(result.items).toEqual([
      {
        kind: "builtinMemberProperty",
        label: "code",
        returnTypeName: "string",
        chainable: false,
      },
    ]);
    expect(result.replaceFrom).toBe(30);
    expect(result.replaceTo).toBe(30);
  });

  it("suggests chained members inside larger expressions", () => {
    const result = IfcExpressionAutocomplete.complete(
      "IF(TRUE, $result.payloadByCode('A.01')., 0)",
      39,
      {
        builtinVariableRegistry: registry,
      }
    );

    expect(result.items).toEqual([
      {
        kind: "builtinMemberProperty",
        label: "code",
        returnTypeName: "string",
        chainable: false,
      },
    ]);
    expect(result.replaceFrom).toBe(39);
    expect(result.replaceTo).toBe(39);
  });

  it("returns no member suggestions when a chained call has the wrong argument count", () => {
    const result = IfcExpressionAutocomplete.complete(
      "$result.payloadByCode('A', 'B').",
      32,
      {
        builtinVariableRegistry: registry,
      }
    );

    expect(result.items).toEqual([]);
    expect(result.replaceFrom).toBe(32);
    expect(result.replaceTo).toBe(32);
  });

  it("includes context-object return type metadata for functions", () => {
    const result = IfcExpressionAutocomplete.complete("$result.", 8, {
      builtinVariableRegistry: registry,
    });

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
      ])
    );
  });

  it("includes context-object return type metadata for properties", () => {
    const result = IfcExpressionAutocomplete.complete("$result.", 8, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual(
      expect.arrayContaining([
        {
          kind: "builtinMemberProperty",
          label: "payload",
          returnTypeName: "payload",
          chainable: true,
        },
      ])
    );
  });

  it("returns no member suggestions for unknown member chains", () => {
    const result = IfcExpressionAutocomplete.complete("$result.unknown.", 16, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual([]);
    expect(result.replaceFrom).toBe(16);
    expect(result.replaceTo).toBe(16);
  });

  it("returns no root suggestions when cursor is not in a builtin root position", () => {
    const result = IfcExpressionAutocomplete.complete("1 + $query", 1, {
      builtinVariableRegistry: registry,
    });

    expect(result.items).toEqual([]);
    expect(result.replaceFrom).toBe(1);
    expect(result.replaceTo).toBe(1);
  });
});
