import type { BuiltinMemberDefinition } from "../builtin/BuiltinVariableRegistry.js";

export type ContextObjectMemberCompletion = {
  definitions: Array<BuiltinMemberDefinition>;
  isIncomplete?: boolean;
};

/**
 * Resolves members of a context-object type without requiring the complete
 * member catalog to be materialized eagerly.
 */
export interface ContextObjectMemberProvider {
  getMemberDefinition(name: string): BuiltinMemberDefinition | undefined;

  completeMembers(prefix: string, limit: number): ContextObjectMemberCompletion;
}

/**
 * Backwards-compatible adapter for the maps used by builtin registrations.
 * The default lookup remains case-insensitive. Provider-specific catalogs can
 * implement ContextObjectMemberProvider directly when names are case-sensitive.
 */
export class MapContextObjectMemberProvider
  implements ContextObjectMemberProvider
{
  private readonly members: Map<string, BuiltinMemberDefinition>;
  private readonly caseSensitive: boolean;

  constructor(
    members: Map<string, BuiltinMemberDefinition>,
    caseSensitive = false
  ) {
    this.caseSensitive = caseSensitive;
    this.members = members;
  }

  getMemberDefinition(name: string): BuiltinMemberDefinition | undefined {
    const normalizedName = this.normalize(name);
    return (
      this.members.get(normalizedName) ??
      [...this.members.entries()].find(
        ([memberName]) => this.normalize(memberName) === normalizedName
      )?.[1]
    );
  }

  completeMembers(
    prefix: string,
    limit: number
  ): ContextObjectMemberCompletion {
    const normalizedPrefix = this.normalize(prefix);
    const matching = [...this.members.entries()]
      .filter(([name]) => this.normalize(name).startsWith(normalizedPrefix))
      .map(([, definition]) => definition);
    const boundedLimit = Math.max(0, limit);
    return {
      definitions: matching.slice(0, boundedLimit),
      isIncomplete: matching.length > boundedLimit || undefined,
    };
  }

  private normalize(name: string): string {
    const withoutSigil = name?.replace(/^\$/, "") ?? "";
    return this.caseSensitive ? withoutSigil : withoutSigil.toUpperCase();
  }
}
