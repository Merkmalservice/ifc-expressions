import { IfcExpressionErrorListener } from "../src/IfcExpressionErrorListener.js";
import { IfcExpression } from "../src/IfcExpression.js";
import { BuiltinVariableRegistry } from "../src/builtin/BuiltinVariableRegistry.js";
import { NoSuchMemberException } from "../src/error/NoSuchMemberException.js";
import { NoSuchMethodException } from "../src/error/NoSuchMethodException.js";
import { Type } from "../src/type/Types.js";

const registry = new BuiltinVariableRegistry([
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
        valueType: new BuiltinVariableRegistry([
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
        ]).getDefinition("payload").type,
      },
    ],
  },
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
]);

describe("Client builtin member access", () => {
  it("parses typed builtin property access", () => {
    const errorListener = new IfcExpressionErrorListener();
    const parseResult = IfcExpression.parse("$result.statusCode", errorListener, {
      builtinVariableRegistry: registry,
    });

    expect(errorListener.getException()).toBeUndefined();
    expect(parseResult.typeManager.getType(parseResult.parseTree)).toBe(Type.NUMERIC);
    expect(IfcExpression.compile(parseResult).toExprString()).toBe(
      "$result.statusCode"
    );
  });

  it("parses typed builtin function access", () => {
    const errorListener = new IfcExpressionErrorListener();
    const parseResult = IfcExpression.parse("$query.matches('name')", errorListener, {
      builtinVariableRegistry: registry,
    });

    expect(errorListener.getException()).toBeUndefined();
    expect(parseResult.typeManager.getType(parseResult.parseTree)).toBe(Type.BOOLEAN);
    expect(IfcExpression.compile(parseResult).toExprString()).toBe(
      "$query.matches('name')"
    );
  });

  it("parses chained builtin property access", () => {
    const errorListener = new IfcExpressionErrorListener();
    const parseResult = IfcExpression.parse("$result.payload.code", errorListener, {
      builtinVariableRegistry: registry,
    });

    expect(errorListener.getException()).toBeUndefined();
    expect(parseResult.typeManager.getType(parseResult.parseTree)).toBe(Type.STRING);
    expect(IfcExpression.compile(parseResult).toExprString()).toBe(
      "$result.payload.code"
    );
  });

  it("rejects unknown builtin properties statically", () => {
    const errorListener = new IfcExpressionErrorListener();
    IfcExpression.parse("$result.missing", errorListener, {
      builtinVariableRegistry: registry,
    });

    expect(errorListener.getException()).toBeInstanceOf(NoSuchMemberException);
  });

  it("rejects unknown builtin functions statically", () => {
    const errorListener = new IfcExpressionErrorListener();
    IfcExpression.parse("$query.missing('name')", errorListener, {
      builtinVariableRegistry: registry,
    });

    expect(errorListener.getException()).toBeInstanceOf(NoSuchMethodException);
  });
});
