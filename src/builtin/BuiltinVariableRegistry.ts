import { ContextObjectType } from "../type/ContextObjectType.js";
import { IfcExpressionBuiltinConfigException } from "../error/IfcExpressionBuiltinConfigException.js";
import { ExprType } from "../type/ExprType.js";
import { Type, Types } from "../type/Types.js";
import { Expr } from "../expression/Expr.js";
import { BuiltinRootReferenceExpr } from "../expression/reference/BuiltinRootReferenceExpr.js";
import { ElemObjectReferenceExpr } from "../expression/reference/ElemObjectReferenceExpr.js";
import { PropObjectReferenceExpr } from "../expression/reference/PropObjectReferenceExpr.js";
import {
  ArgumentDocumentation,
  LocalizedText,
} from "../documentation/Documentation.js";

export type BuiltinPropertyDefinition = {
  name: string;
  kind: "property";
  valueType: ExprType;
  documentation?: LocalizedText;
};

export type BuiltinFunctionDefinition = {
  name: string;
  kind: "function";
  returnType: ExprType;
  argumentTypes: Array<ExprType>;
  documentation?: LocalizedText;
  argumentDocumentation?: Array<ArgumentDocumentation>;
};

export type BuiltinMemberDefinition =
  | BuiltinPropertyDefinition
  | BuiltinFunctionDefinition;

export function isBuiltinPropertyDefinition(
  definition: BuiltinMemberDefinition | undefined
): definition is BuiltinPropertyDefinition {
  return definition?.kind === "property";
}

export function isBuiltinFunctionDefinition(
  definition: BuiltinMemberDefinition | undefined
): definition is BuiltinFunctionDefinition {
  return definition?.kind === "function";
}

export type BuiltinVariableDefinition = {
  name: string;
  type?: ExprType;
  documentation?: LocalizedText;
  members?: Array<BuiltinMemberDefinition>;
  createReferenceExpr?: () => Expr<any>;
};

export type RegisteredBuiltinVariableDefinition = {
  name: string;
  type: ExprType;
  documentation?: LocalizedText;
  members: Map<string, BuiltinMemberDefinition>;
  createReferenceExpr: () => Expr<any>;
};

function normalizeBuiltinName(name: string): string {
  return name?.replace(/^\$/, "").toUpperCase();
}

type StandardIfcObjectTypes = {
  elementType: ContextObjectType;
  propertyType: ContextObjectType;
  propertySetType: ContextObjectType;
  typeObjectType: ContextObjectType;
};

function memberArg(
  labelKey: string,
  labelFallback: string,
  summaryKey: string,
  summaryFallback: string
): ArgumentDocumentation {
  return {
    label: { key: labelKey, fallback: labelFallback },
    documentation: { key: summaryKey, fallback: summaryFallback },
  };
}

function createStandardIfcObjectTypes(): StandardIfcObjectTypes {
  const elementMembers = new Map<string, BuiltinMemberDefinition>();
  const propertyMembers = new Map<string, BuiltinMemberDefinition>();
  const propertySetMembers = new Map<string, BuiltinMemberDefinition>();
  const typeObjectMembers = new Map<string, BuiltinMemberDefinition>();

  const propertyType = new ContextObjectType(
    Type.IFC_PROPERTY_REF.getName(),
    Type.IFC_PROPERTY_REF,
    propertyMembers
  );
  const propertySetType = new ContextObjectType(
    Type.IFC_PROPERTY_SET_REF.getName(),
    Type.IFC_PROPERTY_SET_REF,
    propertySetMembers
  );
  const typeObjectType = new ContextObjectType(
    Type.IFC_TYPE_OBJECT_REF.getName(),
    Type.IFC_TYPE_OBJECT_REF,
    typeObjectMembers
  );
  const elementType = new ContextObjectType(
    Type.IFC_ELEMENT_REF.getName(),
    Type.IFC_ELEMENT_REF,
    elementMembers
  );

  standardIfcElementMembers({
    elementType,
    propertyType,
    propertySetType,
    typeObjectType,
  }).forEach((member) => {
    elementMembers.set(normalizeBuiltinName(member.name), member);
  });
  standardIfcPropertyMembers({
    elementType,
    propertyType,
    propertySetType,
    typeObjectType,
  }).forEach((member) => {
    propertyMembers.set(normalizeBuiltinName(member.name), member);
  });
  standardIfcPropertySetMembers({
    elementType,
    propertyType,
    propertySetType,
    typeObjectType,
  }).forEach((member) => {
    propertySetMembers.set(normalizeBuiltinName(member.name), member);
  });
  standardIfcTypeObjectMembers({
    elementType,
    propertyType,
    propertySetType,
    typeObjectType,
  }).forEach((member) => {
    typeObjectMembers.set(normalizeBuiltinName(member.name), member);
  });

  return {
    elementType,
    propertyType,
    propertySetType,
    typeObjectType,
  };
}

function standardIfcElementMembers(
  types: StandardIfcObjectTypes
): Array<BuiltinMemberDefinition> {
  return [
    {
      name: "name",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$element.name.summary",
        fallback: "name(): name of the current IFC element",
      },
    },
    {
      name: "guid",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$element.guid.summary",
        fallback: "guid(): globally unique identifier of the current IFC element",
      },
    },
    {
      name: "ifcClass",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$element.ifcClass.summary",
        fallback: "ifcClass(): IFC class name of the current element",
      },
    },
    {
      name: "description",
      kind: "function",
      returnType: Type.STRING,
      argumentTypes: [],
      documentation: {
        key: "builtin.$element.description.summary",
        fallback: "description(): description of the current IFC element",
      },
    },
    {
      name: "property",
      kind: "function",
      returnType: types.propertyType,
      argumentTypes: [Type.STRING],
      documentation: {
        key: "builtin.$element.property.summary",
        fallback: "property(name): property of the current IFC element by name",
      },
      argumentDocumentation: [
        memberArg(
          "builtin.$element.property.arg.name.label",
          "name",
          "builtin.$element.property.arg.name.summary",
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
        key: "builtin.$element.propertySet.summary",
        fallback: "propertySet(name): property set of the current IFC element by name",
      },
      argumentDocumentation: [
        memberArg(
          "builtin.$element.propertySet.arg.name.label",
          "name",
          "builtin.$element.propertySet.arg.name.summary",
          "The name of the property set to resolve"
        ),
      ],
    },
    {
      name: "type",
      kind: "function",
      returnType: types.typeObjectType,
      argumentTypes: [],
      documentation: {
        key: "builtin.$element.type.summary",
        fallback: "type(): type object of the current IFC element",
      },
    },
  ];
}

function standardIfcPropertyMembers(
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
}

function standardIfcPropertySetMembers(
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
}

function standardIfcTypeObjectMembers(
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
}

const standardIfcObjectTypes = createStandardIfcObjectTypes();

export class BuiltinVariableRegistry {
  private static readonly defaultRegistry = new BuiltinVariableRegistry([
    {
      name: "element",
      type: Type.IFC_ELEMENT_REF,
      documentation: {
        key: "builtin.$element.summary",
        fallback: "$element: IFC element from the evaluation context",
      },
      members: standardIfcElementMembers(standardIfcObjectTypes),
      createReferenceExpr: () => new ElemObjectReferenceExpr(),
    },
    {
      name: "property",
      type: Type.IFC_PROPERTY_REF,
      documentation: {
        key: "builtin.$property.summary",
        fallback: "$property: IFC property from the evaluation context",
      },
      members: standardIfcPropertyMembers(standardIfcObjectTypes),
      createReferenceExpr: () => new PropObjectReferenceExpr(),
    },
  ]);

  private readonly builtinVariables: Map<
    string,
    RegisteredBuiltinVariableDefinition
  >;

  constructor(definitions: Array<BuiltinVariableDefinition> = []) {
    this.builtinVariables = new Map();
    definitions.forEach((definition) => this.register(definition));
  }

  public static getDefaultRegistry() {
    return this.defaultRegistry;
  }

  public static normalizeName(name: string): string {
    return normalizeBuiltinName(name);
  }

  public static isBuiltinVariable(name: string): boolean {
    return this.defaultRegistry.isBuiltinVariable(name);
  }

  public static isReservedName(name: string): boolean {
    return this.defaultRegistry.isReservedName(name);
  }

  public static getDefinition(
    name: string
  ): RegisteredBuiltinVariableDefinition | undefined {
    return this.defaultRegistry.getDefinition(name);
  }

  public isBuiltinVariable(name: string): boolean {
    return this.builtinVariables.has(
      BuiltinVariableRegistry.normalizeName(name)
    );
  }

  public isReservedName(name: string): boolean {
    return this.isBuiltinVariable(name);
  }

  public getDefinition(
    name: string
  ): RegisteredBuiltinVariableDefinition | undefined {
    return this.builtinVariables.get(
      BuiltinVariableRegistry.normalizeName(name)
    );
  }

  public getDefinitions(): Array<RegisteredBuiltinVariableDefinition> {
    return [...this.builtinVariables.values()];
  }

  private register(definition: BuiltinVariableDefinition) {
    const normalizedName = BuiltinVariableRegistry.normalizeName(
      definition.name
    );
    if (this.builtinVariables.has(normalizedName)) {
      throw new IfcExpressionBuiltinConfigException(
        `cannot register builtin variable with name '${definition.name}': name already in use`
      );
    }
    const members = this.registerMembers(definition);
    const baseType =
      definition.type ??
      (members.size > 0 ? Type.CONTEXT_OBJECT_REF : Type.ANY);
    const resolvedType =
      members.size > 0
        ? new ContextObjectType(definition.name, baseType, members)
        : baseType;
    const createReferenceExpr =
      definition.createReferenceExpr ??
      (() => new BuiltinRootReferenceExpr(definition.name, resolvedType));
    this.builtinVariables.set(normalizedName, {
      name: definition.name,
      type: resolvedType,
      documentation: definition.documentation,
      members,
      createReferenceExpr,
    });
  }

  private registerMembers(definition: BuiltinVariableDefinition) {
    const members = new Map<string, BuiltinMemberDefinition>();
    definition.members?.forEach((member) => {
      const normalizedMemberName = BuiltinVariableRegistry.normalizeName(
        member.name
      );
      if (members.has(normalizedMemberName)) {
        throw new IfcExpressionBuiltinConfigException(
          `cannot register member '${member.name}' for builtin '${definition.name}': name already in use`
        );
      }
      members.set(normalizedMemberName, member);
    });
    return members;
  }
}


