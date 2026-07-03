import {
  BuiltinVariableRegistry,
  isBuiltinFunctionDefinition,
  isBuiltinPropertyDefinition,
} from "../src/builtin/BuiltinVariableRegistry.js";
import { ExprKind } from "../src/IfcExpression.js";
import { IfcExpressionBuiltinConfigException } from "../src/error/IfcExpressionBuiltinConfigException.js";
import { ContextObjectType } from "../src/type/ContextObjectType.js";
import { Type, Types } from "../src/type/Types.js";

describe("BuiltinVariableRegistry", () => {
  it("resolves the built-in IFC roots", () => {
    const elementDefinition = BuiltinVariableRegistry.getDefinition("element");
    const propertyDefinition = BuiltinVariableRegistry.getDefinition("property");

    expect(BuiltinVariableRegistry.isBuiltinVariable("element")).toBe(true);
    expect(BuiltinVariableRegistry.isBuiltinVariable("property")).toBe(true);

    expect(elementDefinition?.type).toBeInstanceOf(ContextObjectType);
    expect(elementDefinition?.type.isSubTypeOf(Type.IFC_ELEMENT_REF)).toBe(true);

    expect(propertyDefinition?.type).toBeInstanceOf(ContextObjectType);
    expect(propertyDefinition?.type.isSubTypeOf(Type.IFC_PROPERTY_REF)).toBe(true);
  });

  it("creates reference expressions for built-in IFC roots through the registry", () => {
    expect(
      BuiltinVariableRegistry.getDefinition("element")?.createReferenceExpr().getKind()
    ).toBe(ExprKind.REF_ELEMENT);
    expect(
      BuiltinVariableRegistry.getDefinition("property")?.createReferenceExpr().getKind()
    ).toBe(ExprKind.REF_PROPERTY);
  });

  it("exposes completable member metadata for built-in IFC roots", () => {
    const elementDefinition = BuiltinVariableRegistry.getDefinition("element");
    const propertyDefinition = BuiltinVariableRegistry.getDefinition("property");

    const elementNameMember = elementDefinition?.members.get("NAME");
    const elementPropertySetMember = elementDefinition?.members.get("PROPERTYSET");
    const propertyValueMember = propertyDefinition?.members.get("VALUE");

    expect(elementDefinition?.members.size).toBeGreaterThan(0);
    expect(propertyDefinition?.members.size).toBeGreaterThan(0);

    expect(isBuiltinFunctionDefinition(elementNameMember)).toBe(true);
    if (!isBuiltinFunctionDefinition(elementNameMember)) {
      throw new Error("expected element name member definition");
    }
    expect(elementNameMember.returnType).toBe(Type.STRING);

    expect(isBuiltinFunctionDefinition(elementPropertySetMember)).toBe(true);
    if (!isBuiltinFunctionDefinition(elementPropertySetMember)) {
      throw new Error("expected element propertySet member definition");
    }
    expect(elementPropertySetMember.argumentTypes).toEqual([Type.STRING]);
    expect(elementPropertySetMember.returnType).toBe(Type.IFC_PROPERTY_SET_REF);

    expect(isBuiltinFunctionDefinition(propertyValueMember)).toBe(true);
    if (!isBuiltinFunctionDefinition(propertyValueMember)) {
      throw new Error("expected property value member definition");
    }
    expect(propertyValueMember.returnType.getName()).toBe(
      Types.or(Type.STRING, Type.NUMERIC, Type.BOOLEAN, Type.ARRAY).getName()
    );
  });

  it("enumerates registered builtin definitions", () => {
    const definitions = BuiltinVariableRegistry.getDefaultRegistry().getDefinitions();

    expect(definitions.map((definition) => definition.name)).toEqual(
      expect.arrayContaining(["element", "property"])
    );
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
