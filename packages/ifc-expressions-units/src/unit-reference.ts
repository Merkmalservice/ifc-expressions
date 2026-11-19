/**
 * Describes how one expression-facing occurrence acquired its unit. Unit
 * identity remains exclusively provider-owned and does not include this value.
 */
export const IfcExpressionUnitProvenance = {
  CATALOG: "catalog",
  PROJECT: "project",
  EXPLICIT: "explicit",
  DEFAULT: "default",
  CALCULATED: "calculated",
  UNKNOWN: "unknown",
} as const;

export type IfcExpressionUnitProvenance =
  (typeof IfcExpressionUnitProvenance)[keyof typeof IfcExpressionUnitProvenance];

export interface IfcExpressionUnitReference<Unit extends object> {
  readonly providerUnit: Unit;
  readonly provenance: IfcExpressionUnitProvenance;

  isProjectUnit(): boolean;
  isExplicitUnit(): boolean;
  isDefaultUnit(): boolean;
}

const unitReferenceOwners = new WeakMap<object, object>();

/**
 * Creates the runtime value used by unit-typed expression members. The proxy
 * keeps provider-defined members reachable without making their representation
 * part of the provider-neutral contract.
 */
export function createIfcExpressionUnitReference<Unit extends object>(
  providerUnit: Unit,
  provenance: IfcExpressionUnitProvenance,
  owner: object
): IfcExpressionUnitReference<Unit> {
  const target: IfcExpressionUnitReference<Unit> = {
    providerUnit,
    provenance,
    isProjectUnit: () => provenance === IfcExpressionUnitProvenance.PROJECT,
    isExplicitUnit: () => provenance === IfcExpressionUnitProvenance.EXPLICIT,
    isDefaultUnit: () => provenance === IfcExpressionUnitProvenance.DEFAULT,
  };
  const reference = new Proxy(target, {
    get(current, property, receiver) {
      if (Reflect.has(current, property)) {
        return Reflect.get(current, property, receiver);
      }
      const value = Reflect.get(providerUnit, property, providerUnit);
      return typeof value === "function" ? value.bind(providerUnit) : value;
    },
    getOwnPropertyDescriptor(current, property) {
      const ownDescriptor = Reflect.getOwnPropertyDescriptor(current, property);
      if (ownDescriptor) {
        return ownDescriptor;
      }
      if (!Reflect.has(providerUnit, property)) {
        return undefined;
      }
      return {
        configurable: true,
        enumerable: true,
        value: Reflect.get(providerUnit, property, providerUnit),
        writable: false,
      };
    },
    ownKeys(current) {
      return [
        ...new Set([
          ...Reflect.ownKeys(current),
          ...Reflect.ownKeys(providerUnit),
        ]),
      ];
    },
  });
  unitReferenceOwners.set(reference, owner);
  return reference;
}

export function isIfcExpressionUnitReference<Unit extends object>(
  value: unknown,
  owner?: object
): value is IfcExpressionUnitReference<Unit> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const actualOwner = unitReferenceOwners.get(value);
  return (
    actualOwner !== undefined && (owner === undefined || actualOwner === owner)
  );
}
