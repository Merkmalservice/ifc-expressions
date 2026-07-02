import { BuiltinObjectType } from "../type/BuiltinObjectType.js";
import { IfcExpressionBuiltinConfigException } from "../error/IfcExpressionBuiltinConfigException.js";
import { ExprType } from "../type/ExprType.js";
import { Type } from "../type/Types.js";

export type BuiltinPropertyDefinition = {
  name: string;
  kind: "property";
  valueType: ExprType;
};

export type BuiltinFunctionDefinition = {
  name: string;
  kind: "function";
  returnType: ExprType;
  argumentTypes: Array<ExprType>;
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
  members?: Array<BuiltinMemberDefinition>;
};

export type RegisteredBuiltinVariableDefinition = {
  name: string;
  type: ExprType;
  members: Map<string, BuiltinMemberDefinition>;
};

export class BuiltinVariableRegistry {
  private static readonly defaultRegistry = new BuiltinVariableRegistry([
    {
      name: "element",
      type: Type.IFC_ELEMENT_REF,
    },
    {
      name: "property",
      type: Type.IFC_PROPERTY_REF,
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
    return name?.replace(/^\$/, "").toUpperCase();
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
    return this.builtinVariables.has(BuiltinVariableRegistry.normalizeName(name));
  }

  public isReservedName(name: string): boolean {
    return this.isBuiltinVariable(name);
  }

  public getDefinition(
    name: string
  ): RegisteredBuiltinVariableDefinition | undefined {
    return this.builtinVariables.get(BuiltinVariableRegistry.normalizeName(name));
  }

  private register(definition: BuiltinVariableDefinition) {
    const normalizedName = BuiltinVariableRegistry.normalizeName(definition.name);
    if (this.builtinVariables.has(normalizedName)) {
      throw new IfcExpressionBuiltinConfigException(
        `cannot register builtin variable with name '${definition.name}': name already in use`
      );
    }
    const members = this.registerMembers(definition);
    const baseType =
      definition.type ?? (members.size > 0 ? Type.CONTEXT_OBJECT_REF : Type.ANY);
    const resolvedType =
      members.size > 0
        ? new BuiltinObjectType(definition.name, baseType, members)
        : baseType;
    this.builtinVariables.set(normalizedName, {
      name: definition.name,
      type: resolvedType,
      members,
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
