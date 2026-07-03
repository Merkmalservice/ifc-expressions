const fs = require("fs");
const path = "src\\builtin\\BuiltinVariableRegistry.ts";
let s = fs.readFileSync(path, "utf8");
const propertyMembersOld = `function standardIfcPropertyMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "ifcClass",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "propertySet",
      kind: "function",
      returnType: types.propertySetType,
      argumentTypes: [],
    },
    {
      name: "value",
      kind: "function",
      returnType: Types.or(Type.STRING, Type.NUMERIC, Type.BOOLEAN, Type.ARRAY),
      argumentTypes: [],
    },
  ];
}`;
const propertyMembersNew = `function standardIfcPropertyMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$property.name.summary",
        fallback: "name(): name of the current IFC property",
      },
    },
    {
      name: "ifcClass",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$property.ifcClass.summary",
        fallback: "ifcClass(): IFC class name of the current property",
      },
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$property.description.summary",
        fallback: "description(): description of the current IFC property",
      },
    },
    {
      name: "propertySet",
      kind: "function",
      returnType: types.propertySetType,
      argumentTypes: [],
      documentation: {
        key: "builtin.$property.propertySet.summary",
        fallback: "propertySet(): property set containing the current IFC property",
      },
    },
    {
      name: "value",
      kind: "function",
      returnType: Types.or(Type.STRING, Type.NUMERIC, Type.BOOLEAN, Type.ARRAY),
      argumentTypes: [],
      documentation: {
        key: "builtin.$property.value.summary",
        fallback: "value(): value of the current IFC property",
      },
    },
  ];
}`;
const propertySetMembersOld = `function standardIfcPropertySetMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "guid",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "property",
      kind: "function",
      returnType: types.propertyType,
      argumentTypes: [Type.STRING],
    },
  ];
}`;
const propertySetMembersNew = `function standardIfcPropertySetMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$propertySet.name.summary",
        fallback: "name(): name of the current IFC property set",
      },
    },
    {
      name: "guid",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$propertySet.guid.summary",
        fallback: "guid(): globally unique identifier of the current IFC property set",
      },
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$propertySet.description.summary",
        fallback: "description(): description of the current IFC property set",
      },
    },
    {
      name: "property",
      kind: "function",
      returnType: types.propertyType,
      argumentTypes: [Type.STRING],
      documentation: {
        key: "builtin.$propertySet.property.summary",
        fallback: "property(name): property of the current IFC property set by name",
      },
      argumentDocumentation: [
        memberArg(
          "builtin.$propertySet.property.arg.name.label",
          "name",
          "builtin.$propertySet.property.arg.name.summary",
          "The name of the property to resolve"
        ),
      ],
    },
  ];
}`;
const typeObjectMembersOld = `function standardIfcTypeObjectMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "guid",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
    },
    {
      name: "property",
      kind: "function",
      returnType: types.propertyType,
      argumentTypes: [Type.STRING],
    },
    {
      name: "propertySet",
      kind: "function",
      returnType: types.propertySetType,
      argumentTypes: [Type.STRING],
    },
  ];
}`;
const typeObjectMembersNew = `function standardIfcTypeObjectMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$typeObject.name.summary",
        fallback: "name(): name of the current IFC type object",
      },
    },
    {
      name: "guid",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$typeObject.guid.summary",
        fallback: "guid(): globally unique identifier of the current IFC type object",
      },
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$typeObject.description.summary",
        fallback: "description(): description of the current IFC type object",
      },
    },
    {
      name: "property",
      kind: "function",
      returnType: types.propertyType,
      argumentTypes: [Type.STRING],
      documentation: {
        key: "builtin.$typeObject.property.summary",
        fallback: "property(name): property of the current IFC type object by name",
      },
      argumentDocumentation: [
        memberArg(
          "builtin.$typeObject.property.arg.name.label",
          "name",
          "builtin.$typeObject.property.arg.name.summary",
          "The name of the property to resolve"
        ),
      ],
    },
    {
      name: "propertySet",
      kind: "function",
      returnType: types.propertySetType,
      argumentTypes: [Type.STRING],
      documentation: {
        key: "builtin.$typeObject.propertySet.summary",
        fallback: "propertySet(name): property set of the current IFC type object by name",
      },
      argumentDocumentation: [
        memberArg(
          "builtin.$typeObject.propertySet.arg.name.label",
          "name",
          "builtin.$typeObject.propertySet.arg.name.summary",
          "The name of the property set to resolve"
        ),
      ],
    },
  ];
}`;
for (const [oldBlock, newBlock] of [[propertyMembersOld, propertyMembersNew], [propertySetMembersOld, propertySetMembersNew], [typeObjectMembersOld, typeObjectMembersNew]]) {
  if (!s.includes(oldBlock)) {
    throw new Error("Expected block not found while updating BuiltinVariableRegistry.ts");
  }
  s = s.replace(oldBlock, newBlock);
}
fs.writeFileSync(path, s);
