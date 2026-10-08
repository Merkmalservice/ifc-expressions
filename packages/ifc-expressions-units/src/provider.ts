import type { ContextObjectMemberProvider } from "ifc-expressions";

export type IfcExpressionCatalogCompletion = {
  names: ReadonlyArray<string>;
  isIncomplete?: boolean;
};

export interface IfcExpressionValueCatalog<Value extends object> {
  readonly name: string;
  resolve(name: string): Value | undefined;
  complete(prefix: string, limit: number): IfcExpressionCatalogCompletion;
}

/**
 * Provider-owned unit and measure objects are opaque to the units extension.
 * Conversion, equality, compatibility, and hierarchy stay with the provider.
 */
export interface IfcExpressionUnitProvider<
  Unit extends object,
  Measure extends object
> {
  readonly id: string;

  resolveUnit(name: string): Unit | undefined;
  resolveMeasure(name: string): Measure | undefined;

  unitsEqual(left: Unit, right: Unit): boolean;
  measuresEqual(left: Measure, right: Measure): boolean;
  convert(value: number, from: Unit, to: Unit): number;
  isConvertible(from: Unit, to: Unit): boolean;
  isSubKindOf(actual: Measure, broader: Measure): boolean;

  /** Optional expression-facing members such as provenance predicates. */
  readonly unitMembers?: ContextObjectMemberProvider;
  readonly measureMembers?: ContextObjectMemberProvider;
  readonly unitCatalogs?: ReadonlyArray<IfcExpressionValueCatalog<Unit>>;
  readonly measureCatalogs?: ReadonlyArray<IfcExpressionValueCatalog<Measure>>;
}

export class IfcExpressionUnitsConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IfcExpressionUnitsConfigurationError";
  }
}
