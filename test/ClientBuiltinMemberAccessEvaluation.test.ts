import { IfcExpression } from "../src/IfcExpression.js";
import { BuiltinVariableRegistry } from "../src/builtin/BuiltinVariableRegistry.js";
import {
  ExprEvalStatus,
  ExprEvalSuccessObj,
  isExprEvalSuccess,
} from "../src/expression/ExprEvalResult.js";
import { ExprKind } from "../src/expression/ExprKind.js";
import { BooleanValue } from "../src/value/BooleanValue.js";
import { NumericValue } from "../src/value/NumericValue.js";
import { StringValue } from "../src/value/StringValue.js";
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
        valueType: payloadRegistry.getDefinition("payload").type,
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

const clientContext = {
  resolveElemRef() {
    throw new Error("not used in this test");
  },
  resolvePropRef() {
    throw new Error("not used in this test");
  },
  resolveBuiltinVariable(name: string) {
    switch (name) {
      case "result":
        return {
          statusCode: 200,
          payload: {
            code: "ok",
          },
        };
      case "query":
        return {
          property: "Name",
          matches(input: string) {
            return this.property.toLowerCase() === input.toLowerCase();
          },
        };
      default:
        return undefined;
    }
  },
};

describe("Client builtin member evaluation", () => {
  it("evaluates typed builtin property access", () => {
    const actual = IfcExpression.evaluate("$result.statusCode", clientContext, {
      builtinVariableRegistry: registry,
    });

    expect(actual).toStrictEqual(new ExprEvalSuccessObj(NumericValue.of(200)));
  });

  it("evaluates typed builtin function access", () => {
    const actual = IfcExpression.evaluate(
      "$query.matches('name')",
      clientContext,
      { builtinVariableRegistry: registry }
    );

    expect(actual).toStrictEqual(new ExprEvalSuccessObj(BooleanValue.of(true)));
  });

  it("evaluates chained builtin property access", () => {
    const actual = IfcExpression.evaluate(
      "$result.payload.code",
      clientContext,
      { builtinVariableRegistry: registry }
    );

    expect(actual).toStrictEqual(new ExprEvalSuccessObj(StringValue.of("ok")));
  });

  it("reports missing builtin roots clearly", () => {
    const actual = IfcExpression.evaluate(
      "$missing.statusCode",
      clientContext,
      {
        builtinVariableRegistry: new BuiltinVariableRegistry([
          {
            name: "$missing",
            type: Type.CONTEXT_OBJECT_REF,
            members: [
              {
                name: "statusCode",
                kind: "property",
                valueType: Type.NUMERIC,
              },
            ],
          },
        ]),
      }
    );

    expect(isExprEvalSuccess(actual)).toBe(false);
    if (isExprEvalSuccess(actual)) {
      throw new Error("expected evaluation error");
    }
    expect(actual).toMatchObject({
      exprKind: ExprKind.REF_BUILTIN_ROOT,
      status: ExprEvalStatus.NOT_FOUND,
      message: "No builtin variable found with name '$missing'",
    });
  });

  it("reports missing runtime members clearly", () => {
    const actual = IfcExpression.evaluate(
      "$result.payload.code",
      {
        ...clientContext,
        resolveBuiltinVariable(name: string) {
          if (name === "result") {
            return { payload: {} };
          }
          return clientContext.resolveBuiltinVariable(name);
        },
      },
      { builtinVariableRegistry: registry }
    );

    expect(isExprEvalSuccess(actual)).toBe(false);
    if (isExprEvalSuccess(actual)) {
      throw new Error("expected evaluation error");
    }
    expect(actual).toMatchObject({
      exprKind: ExprKind.REF_BUILTIN_MEMBER,
      status: ExprEvalStatus.NOT_FOUND,
      message: "No builtin member 'code' found on '$payload'",
    });
  });
});
