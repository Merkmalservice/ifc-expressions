import {
  BuiltinVariableRegistry,
  ContextObjectMemberCompletion,
  ContextObjectMemberProvider,
  ContextObjectType,
  IfcExpressionAutocomplete,
} from "../src/IfcExpression.js";
import { BuiltinMemberDefinition } from "../src/builtin/BuiltinVariableRegistry.js";
import { Type } from "../src/type/Types.js";

class LiteralCatalogProvider implements ContextObjectMemberProvider {
  readonly completionCalls: Array<{ prefix: string; limit: number }> = [];

  private readonly definitions: Array<BuiltinMemberDefinition> = [
    { name: "CI", kind: "property", valueType: Type.STRING },
    { name: "Ci", kind: "property", valueType: Type.NUMERIC },
    { name: "Centimetre", kind: "property", valueType: Type.STRING },
  ];

  getMemberDefinition(name: string): BuiltinMemberDefinition | undefined {
    return this.definitions.find((definition) => definition.name === name);
  }

  completeMembers(
    prefix: string,
    limit: number
  ): ContextObjectMemberCompletion {
    this.completionCalls.push({ prefix, limit });
    const matching = this.definitions.filter((definition) =>
      definition.name.startsWith(prefix)
    );
    return {
      definitions: matching.slice(0, 1),
      isIncomplete: matching.length > 1,
    };
  }
}

describe("ContextObjectMemberProvider", () => {
  it("lets provider catalogs define literal case-sensitive member lookup", () => {
    const provider = new LiteralCatalogProvider();
    const type = new ContextObjectType(
      "catalog",
      Type.CONTEXT_OBJECT_REF,
      provider
    );

    expect(type.getMemberDefinition("CI")).toEqual(
      expect.objectContaining({ valueType: Type.STRING })
    );
    expect(type.getMemberDefinition("Ci")).toEqual(
      expect.objectContaining({ valueType: Type.NUMERIC })
    );
    expect(type.getMemberDefinition("ci")).toBeUndefined();
  });

  it("uses bounded provider completion and propagates incomplete results", () => {
    const provider = new LiteralCatalogProvider();
    const type = new ContextObjectType(
      "catalog",
      Type.CONTEXT_OBJECT_REF,
      provider
    );
    const registry = new BuiltinVariableRegistry([{ name: "$catalog", type }]);

    const result = IfcExpressionAutocomplete.complete("$catalog.C", 10, {
      builtinVariableRegistry: registry,
    });

    expect(result.items.map((item) => item.label)).toEqual(["CI"]);
    expect(result.isIncomplete).toBe(true);
    expect(provider.completionCalls).toEqual([{ prefix: "C", limit: 100 }]);
  });
});
