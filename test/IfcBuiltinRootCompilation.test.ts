import { BuiltinVariableRegistry } from "../src/builtin/BuiltinVariableRegistry.js";
import { ExprKind, IfcExpression } from "../src/IfcExpression.js";
import { Type } from "../src/type/Types.js";

const clientBuiltinRegistry = new BuiltinVariableRegistry([
  {
    name: "$query",
    type: Type.CONTEXT_OBJECT_REF,
    members: [
      {
        name: "property",
        kind: "property",
        valueType: Type.STRING,
      },
    ],
  },
]);

describe("IFC builtin root compilation", () => {
  it("compiles $element through the builtin registry to the IFC element reference kind", () => {
    const compiled = IfcExpression.compile(IfcExpression.parse("$element"));

    expect(compiled.getKind()).toBe(ExprKind.REF_ELEMENT);
  });

  it("compiles $property through the builtin registry to the IFC property reference kind", () => {
    const compiled = IfcExpression.compile(IfcExpression.parse("$property"));

    expect(compiled.getKind()).toBe(ExprKind.REF_PROPERTY);
  });

  it("still compiles client builtins to the generic builtin root kind", () => {
    const compiled = IfcExpression.compile(
      IfcExpression.parse("$query", undefined, {
        builtinVariableRegistry: clientBuiltinRegistry,
      })
    );

    expect(compiled.getKind()).toBe(ExprKind.REF_BUILTIN_ROOT);
  });
});
