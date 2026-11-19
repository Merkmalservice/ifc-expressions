import { ExprType } from "./ExprType.js";
import {
  BuiltinMemberDefinition,
  RegisteredBuiltinVariableDefinition,
} from "../builtin/BuiltinVariableRegistry.js";
import {
  ContextObjectOperator,
  ContextObjectTypeFactory,
} from "./ContextObjectTypeFactory.js";
import { ContextObjectValue } from "../value/ContextObjectValue.js";
import {
  ContextObjectMemberCompletion,
  ContextObjectMemberProvider,
  MapContextObjectMemberProvider,
} from "./ContextObjectMemberProvider.js";

export class ContextObjectType implements ExprType {
  private readonly name: string;
  private readonly baseType: ExprType;
  private readonly memberProvider: ContextObjectMemberProvider;
  private readonly factory?: ContextObjectTypeFactory<any>;

  constructor(
    name: string,
    baseType: ExprType,
    members: Map<string, BuiltinMemberDefinition> | ContextObjectMemberProvider,
    factory?: ContextObjectTypeFactory<any>
  ) {
    this.name = name;
    this.baseType = baseType;
    this.memberProvider =
      members instanceof Map
        ? new MapContextObjectMemberProvider(members)
        : members;
    this.factory = factory;
  }

  public static fromBuiltinDefinition(
    definition: RegisteredBuiltinVariableDefinition
  ) {
    return new ContextObjectType(
      definition.name,
      definition.type,
      definition.members
    );
  }

  getMemberDefinition(name: string): BuiltinMemberDefinition | undefined {
    return this.memberProvider.getMemberDefinition(name);
  }

  getMemberDefinitions(): Array<BuiltinMemberDefinition> {
    return this.completeMembers("", Number.MAX_SAFE_INTEGER).definitions;
  }

  completeMembers(prefix: string, limit = 100): ContextObjectMemberCompletion {
    return this.memberProvider.completeMembers(prefix, limit);
  }

  getName(): string {
    return this.name;
  }

  getFactory(): ContextObjectTypeFactory<any> | undefined {
    return this.factory;
  }

  supportsOperator(operator: ContextObjectOperator): boolean {
    return this.factory?.getBinaryOperator(operator) !== undefined;
  }

  createValue(value: unknown): ContextObjectValue<any> {
    if (!this.factory) {
      return new ContextObjectValue(value, this);
    }
    const result = this.factory.createValue(value, this);
    if (!(result instanceof ContextObjectValue) || result.getType() !== this) {
      throw new Error(
        `Context-object factory for '${this.name}' returned a value with the wrong type`
      );
    }
    return result;
  }

  isSuperTypeOf(other: ExprType): boolean {
    return other.isSubTypeOf(this);
  }

  isSameTypeAs(other: ExprType): boolean {
    if (this === other) {
      return true;
    }
    if (other instanceof ContextObjectType) {
      if (this.factory || other.factory) {
        return this.factory !== undefined && this.factory === other.factory;
      }
    }
    return other.getName() === this.getName();
  }

  isSubTypeOf(other: ExprType): boolean {
    return (
      this.baseType.isSameTypeAs(other) || this.baseType.isSubTypeOf(other)
    );
  }

  overlapsWith(other: ExprType): boolean {
    if (this.isSameTypeAs(other)) {
      return true;
    }
    if (other instanceof ContextObjectType) {
      if (this.factory || other.factory) {
        return this.factory !== undefined && this.factory === other.factory;
      }
      return this.baseType.overlapsWith(other.baseType);
    }
    return this.baseType.overlapsWith(other);
  }

  isAssignableFrom(other: ExprType) {
    return this.isSameTypeAs(other) || this.isSuperTypeOf(other);
  }
}
