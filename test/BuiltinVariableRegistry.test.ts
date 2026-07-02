import {
  BuiltinVariableRegistry,
  isBuiltinFunctionDefinition,
  isBuiltinPropertyDefinition,
} from "../src/builtin/BuiltinVariableRegistry.js";
import { ExprKind } from "../src/IfcExpression.js";
import { IfcExpressionBuiltinConfigException } from "../src/error/IfcExpressionBuiltinConfigException.js";
import { ContextObjectType } from "../src/type/ContextObjectType.js";
import { Type } from "../src/type/Types.js";

describe("BuiltinVariableRegistry", () => {
  it("resolves the built-in IFC roots", () => {
    expect(BuiltinVariableRegistry.isBuiltinVariable("element")).toBe(true);
    expect(BuiltinVariableRegistry.isBuiltinVariable("property")).toBe(true);

    expect(BuiltinVariableRegistry.getDefinition("element")?.type).toBe(
      Type.IFC_ELEMENT_REF
    );
    expect(BuiltinVariableRegistry.getDefinition("property")?.type).toBe(
      Type.IFC_PROPERTY_REF
    );
  });

  it("creates reference expressions for built-in IFC roots through the registry", () => {
    expect(
      BuiltinVariableRegistry.getDefinition("element")?.createReferenceExpr().getKind()
    ).toBe(ExprKind.REF_ELEMENT);
    expect(
      BuiltinVariableRegistry.getDefinition("property")?.createReferenceExpr().getKind()
    ).toBe(ExprKind.REF_PROPERTY);
  });

  it("normalizes names consistently", () => {
    expect(BuiltinVariableRegistry.getDefinition("ELEMENT")).toBe(
      BuiltinVariableRegistry.getDefinition("element")
    );
    expect(BuiltinVariableRegistry.getDefinition("PROPERTY")).toBe(
      BuiltinVariableRegistry.getDefinition("property")
    );
  });

  it("supports context-object builtins with typed members", () => {
    const registry = new BuiltinVariableRegistry([
      {
        name: "$thequery",
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
        name: "$theresult",
        type: Type.CONTEXT_OBJECT_REF,
        members: [
          {
            name: "statusCode",
            kind: "property",
            valueType: Type.NUMERIC,
          },
        ],
      },
    ]);

    expect(registry.isBuiltinVariable("$THEQUERY")).toBe(true);
    expect(registry.isBuiltinVariable("theresult")).toBe(true);
    expect(registry.isReservedName("$thequery")).toBe(true);
    expect(registry.isReservedName("theresult")).toBe(true);

    const queryDefinition = registry.getDefinition("$thequery");
    expect(queryDefinition?.type).toBeInstanceOf(ContextObjectType);
    expect(queryDefinition?.type.isSubTypeOf(Type.CONTEXT_OBJECT_REF)).toBe(true);
    expect(queryDefinition?.type.overlapsWith(Type.IFC_OBJECT_REF)).toBe(false);
    expect(queryDefinition?.createReferenceExpr().getKind()).toBe(
      ExprKind.REF_BUILTIN_ROOT
    );

    const propertyMember = queryDefinition?.members.get("PROPERTY");
    const matchesMember = queryDefinition?.members.get("MATCHES");

    expect(isBuiltinPropertyDefinition(propertyMember)).toBe(true);
    if (!isBuiltinPropertyDefinition(propertyMember)) {
      throw new Error("expected property member definition");
    }
    expect(propertyMember.valueType).toBe(Type.STRING);

    expect(isBuiltinFunctionDefinition(matchesMember)).toBe(true);
    if (!isBuiltinFunctionDefinition(matchesMember)) {
      throw new Error("expected function member definition");
    }
    expect(matchesMember.returnType).toBe(Type.BOOLEAN);
    expect(matchesMember.argumentTypes).toEqual([Type.STRING]);
  });

  it("rejects duplicate builtin names and duplicate member names", () => {
    expect(
      () =>
        new BuiltinVariableRegistry([
          { name: "$thequery", type: Type.CONTEXT_OBJECT_REF },
          { name: "thequery", type: Type.CONTEXT_OBJECT_REF },
        ])
    ).toThrow(IfcExpressionBuiltinConfigException);

    expect(
      () =>
        new BuiltinVariableRegistry([
          {
            name: "$theresult",
            type: Type.CONTEXT_OBJECT_REF,
            members: [
              {
                name: "statusCode",
                kind: "property",
                valueType: Type.NUMERIC,
              },
              {
                name: "STATUSCODE",
                kind: "property",
                valueType: Type.STRING,
              },
            ],
          },
        ])
    ).toThrow(IfcExpressionBuiltinConfigException);
  });
});
