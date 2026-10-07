import { ExprType } from "./ExprType.js";
import {
  BuiltinMemberDefinition,
  RegisteredBuiltinVariableDefinition,
} from "../builtin/BuiltinVariableRegistry.js";

export class ContextObjectType implements ExprType {
  private readonly name: string;
  private readonly baseType: ExprType;
  private readonly members: Map<string, BuiltinMemberDefinition>;

  constructor(
    name: string,
    baseType: ExprType,
    members: Map<string, BuiltinMemberDefinition>
  ) {
    this.name = name;
    this.baseType = baseType;
    this.members = members;
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
    return this.members.get(name?.replace(/^\$/, "").toUpperCase());
  }

  getMemberDefinitions(): Array<BuiltinMemberDefinition> {
    return [...this.members.values()];
  }

  getName(): string {
    return this.name;
  }

  isSuperTypeOf(other: ExprType): boolean {
    return other.isSubTypeOf(this);
  }

  isSameTypeAs(other: ExprType): boolean {
    return this === other || other.getName() === this.getName();
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
      return this.baseType.overlapsWith(other.baseType);
    }
    return this.baseType.overlapsWith(other);
  }

  isAssignableFrom(other: ExprType) {
    return this.isSameTypeAs(other) || this.isSuperTypeOf(other);
  }
}
