import Decimal from "decimal.js";
import {
  BooleanValue,
  IfcExpression,
  IfcTimeStampValue,
  LogicalValue,
  NumericValue,
  StringValue,
  isExprEvalSuccess,
} from "../src/IfcExpression.js";
import { BuiltinVariableRegistry } from "../src/builtin/BuiltinVariableRegistry.js";
import { Type } from "../src/type/Types.js";
import { ArrayValue } from "../src/value/ArrayValue.js";
import { ctxSimple } from "./SimpleIfcExpressionContext.js";

function expectDecimalEqual(value: unknown, expected: string) {
  expect(value).toBeInstanceOf(Decimal);
  expect((value as Decimal).eq(new Decimal(expected))).toBe(true);
}

describe("IfcExpression.unwrapValue", () => {
  it("unwraps string values", () => {
    expect(IfcExpression.unwrapValue(StringValue.of("hello"))).toBe("hello");
  });

  it("unwraps numeric values to Decimal without losing precision", () => {
    const unwrapped = IfcExpression.unwrapValue(
      NumericValue.of("1234567890.123456789")
    );

    expectDecimalEqual(unwrapped, "1234567890.123456789");
  });

  it("unwraps boolean values", () => {
    expect(IfcExpression.unwrapValue(BooleanValue.of(true))).toBe(true);
  });

  it("unwraps logical unknown to undefined", () => {
    expect(IfcExpression.unwrapValue(LogicalValue.unknown())).toBeUndefined();
  });

  it("unwraps arrays recursively", () => {
    const unwrapped = IfcExpression.unwrapValue(
      ArrayValue.of([
        StringValue.of("alpha"),
        NumericValue.of("42.5"),
        LogicalValue.unknown(),
      ])
    );

    expect(Array.isArray(unwrapped)).toBe(true);
    expect(unwrapped[0]).toBe("alpha");
    expectDecimalEqual(unwrapped[1], "42.5");
    expect(unwrapped[2]).toBeUndefined();
  });

  it("unwraps IFC timestamps to Decimal", () => {
    const unwrapped = IfcExpression.unwrapValue(
      IfcTimeStampValue.of("1727959984")
    );

    expectDecimalEqual(unwrapped, "1727959984");
  });

  it("unwraps evaluated IFC element references to a plain object structure", () => {
    const result = IfcExpression.evaluate("$element", ctxSimple);

    expect(isExprEvalSuccess(result)).toBe(true);
    if (!isExprEvalSuccess(result)) {
      throw new Error("Expected evaluation success");
    }
    const unwrapped = IfcExpression.unwrapValue(result.result);
    expect(unwrapped).toEqual(
      expect.objectContaining({
        guid: "25lDy1lKL0189KIclXWspu",
        name: "Geschossdecke:DE_STB - 20,0 cm:2309081",
        description: "An IFC element for testing",
        ifcClass: "IfcSlab",
      })
    );
  });

  it("unwraps evaluated client builtin roots with nested plain objects and arrays", () => {
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
            valueType: Type.CONTEXT_OBJECT_REF,
          },
          {
            name: "tags",
            kind: "property",
            valueType: Type.ARRAY,
          },
        ],
      },
    ]);

    const result = IfcExpression.evaluate(
      "$result",
      {
        resolveElemRef() {
          throw new Error("not used in this test");
        },
        resolvePropRef() {
          throw new Error("not used in this test");
        },
        resolveBuiltinVariable(name: string) {
          if (name === "result") {
            return {
              statusCode: 200,
              payload: {
                code: "ok",
                retries: 3,
                nested: {
                  active: true,
                  pending: LogicalValue.unknown(),
                },
              },
              tags: ["alpha", 2, { score: 4.5 }],
            };
          }
          return undefined;
        },
      },
      { builtinVariableRegistry: registry }
    );

    expect(isExprEvalSuccess(result)).toBe(true);
    if (!isExprEvalSuccess(result)) {
      throw new Error("Expected evaluation success");
    }

    const unwrapped = IfcExpression.unwrapValue(result.result);
    expect(unwrapped).toMatchObject({
      payload: {
        code: "ok",
        nested: {
          active: true,
          pending: undefined,
        },
      },
    });
    expectDecimalEqual(
      (unwrapped as Record<string, unknown>).statusCode,
      "200"
    );

    const payload = (unwrapped as Record<string, Record<string, unknown>>)
      .payload;
    expectDecimalEqual(payload.retries, "3");

    const tags = (unwrapped as Record<string, unknown[]>).tags;
    expect(tags[0]).toBe("alpha");
    expectDecimalEqual(tags[1], "2");
    expectDecimalEqual((tags[2] as Record<string, unknown>).score, "4.5");
  });

  it("unwraps evaluated IFC property references to a plain object structure", () => {
    const result = IfcExpression.evaluate("$property", ctxSimple);

    expect(isExprEvalSuccess(result)).toBe(true);
    if (!isExprEvalSuccess(result)) {
      throw new Error("Expected evaluation success");
    }
    const unwrapped = IfcExpression.unwrapValue(result.result);
    expect(unwrapped).toEqual(
      expect.objectContaining({
        name: "Bewehrungsgrad",
        description: "The reinforcement ratio of concrete",
      })
    );
    expectDecimalEqual((unwrapped as Record<string, unknown>).value, "120");
  });
});
