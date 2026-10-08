import {
  BuiltinMemberDefinition,
  BuiltinVariableDefinition,
  ContextObjectMemberProvider,
  ContextObjectOperator,
  ContextObjectType,
  ContextObjectTypeFactory,
  ContextObjectValue,
  MapContextObjectMemberProvider,
  Types,
} from "ifc-expressions";
import {
  IFC_PORTABLE_MEASURE_NAMES,
  IFC_PORTABLE_UNIT_NAMES,
} from "./catalogs.js";
import {
  IfcExpressionUnitProvider,
  IfcExpressionUnitsConfigurationError,
  IfcExpressionValueCatalog,
} from "./provider.js";

export type IfcExpressionUnitsEnvironment<
  Unit extends object,
  Measure extends object
> = {
  readonly provider: IfcExpressionUnitProvider<Unit, Measure>;
  readonly unitType: ContextObjectType;
  readonly measureType: ContextObjectType;
  readonly builtinDefinitions: ReadonlyArray<BuiltinVariableDefinition>;
  readonly builtinValues: Readonly<{
    unit: Record<string, unknown>;
    measure: Record<string, unknown>;
  }>;
  resolveBuiltinVariable(name: string): unknown;
};

class ProviderValueFactory<T extends object>
  implements ContextObjectTypeFactory<T>
{
  constructor(private readonly equals: (left: T, right: T) => boolean) {}

  createValue(value: T, type: ContextObjectType): ContextObjectValue<T> {
    return new ContextObjectValue(value, type);
  }

  getBinaryOperator(operator: ContextObjectOperator) {
    return operator === ContextObjectOperator.EQUALS ? this.equals : undefined;
  }
}

class CatalogMemberProvider<T extends object>
  implements ContextObjectMemberProvider
{
  constructor(
    private readonly catalog: IfcExpressionValueCatalog<T>,
    private readonly valueType: ContextObjectType
  ) {}

  getMemberDefinition(name: string): BuiltinMemberDefinition | undefined {
    return this.catalog.resolve(name)
      ? { name, kind: "property", valueType: this.valueType }
      : undefined;
  }

  completeMembers(prefix: string, limit: number) {
    const completion = this.catalog.complete(prefix, limit);
    return {
      definitions: completion.names.map((name) => ({
        name,
        kind: "property" as const,
        valueType: this.valueType,
      })),
      isIncomplete: completion.isIncomplete,
    };
  }
}

function catalogRuntimeValue<T extends object>(
  catalog: IfcExpressionValueCatalog<T>
): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(_target, property) {
        return typeof property === "string"
          ? catalog.resolve(property)
          : undefined;
      },
      getOwnPropertyDescriptor(_target, property) {
        if (
          typeof property !== "string" ||
          typeof catalog.resolve(property) === "undefined"
        ) {
          return undefined;
        }
        return { configurable: true, enumerable: true };
      },
    }
  );
}

function addCatalogs<T extends object>(
  providerId: string,
  kind: "unit" | "measure",
  catalogs: ReadonlyArray<IfcExpressionValueCatalog<T>> | undefined,
  valueType: ContextObjectType,
  rootMembers: Map<string, BuiltinMemberDefinition>,
  rootValues: Record<string, unknown>
): void {
  const seen = new Set<string>();
  for (const catalog of catalogs ?? []) {
    const normalizedName = catalog.name.toUpperCase();
    if (
      !catalog.name ||
      seen.has(normalizedName) ||
      rootMembers.has(normalizedName)
    ) {
      throw new IfcExpressionUnitsConfigurationError(
        `Unit provider '${providerId}' has duplicate or invalid ${kind} catalog name '${catalog.name}'.`
      );
    }
    seen.add(normalizedName);
    const catalogType = new ContextObjectType(
      `${providerId}:${kind}-catalog:${catalog.name}`,
      Types.contextObjectRef(),
      new CatalogMemberProvider(catalog, valueType)
    );
    rootMembers.set(normalizedName, {
      name: catalog.name,
      kind: "property",
      valueType: catalogType,
    });
    rootValues[catalog.name] = catalogRuntimeValue(catalog);
  }
}

function emptyMembers(): ContextObjectMemberProvider {
  return new MapContextObjectMemberProvider(new Map());
}

function requirePortableCatalogEntry<T extends object>(
  providerId: string,
  kind: "unit" | "measure",
  name: string,
  value: T | undefined
): T {
  if (value) {
    return value;
  }
  throw new IfcExpressionUnitsConfigurationError(
    `Unit provider '${providerId}' does not supply required portable ${kind} '${name}'.`
  );
}

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }
  if (
    typeof value === "object" &&
    value !== null &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }
  const converted = Number(value);
  if (!Number.isFinite(converted)) {
    throw new TypeError(`Cannot convert '${String(value)}' to a number`);
  }
  return converted;
}

function validateProvider<Unit extends object, Measure extends object>(
  provider: IfcExpressionUnitProvider<Unit, Measure>
): void {
  const requiredFunctions = [
    "resolveUnit",
    "resolveMeasure",
    "unitsEqual",
    "measuresEqual",
    "convert",
    "isConvertible",
    "isSubKindOf",
  ] as const;
  const missing = requiredFunctions.filter(
    (name) => typeof provider[name] !== "function"
  );
  if (missing.length > 0) {
    throw new IfcExpressionUnitsConfigurationError(
      `Unit provider '${
        provider.id
      }' is incomplete; missing capabilities: ${missing.join(", ")}.`
    );
  }
}

export function createIfcExpressionUnitsEnvironment<
  Unit extends object,
  Measure extends object
>(
  provider: IfcExpressionUnitProvider<Unit, Measure> | undefined
): IfcExpressionUnitsEnvironment<Unit, Measure> {
  if (!provider) {
    throw new IfcExpressionUnitsConfigurationError(
      "ifc-expressions-units requires a unit provider. Install ifc-expressions-units-qudtlib and pass its provider to createIfcExpressionUnitsEnvironment(), or pass another compatible provider."
    );
  }
  if (!provider.id?.trim()) {
    throw new IfcExpressionUnitsConfigurationError(
      "The configured ifc-expressions unit provider must have a non-empty id."
    );
  }
  validateProvider(provider);

  const unitFactory = new ProviderValueFactory(
    provider.unitsEqual.bind(provider)
  );
  const measureFactory = new ProviderValueFactory(
    provider.measuresEqual.bind(provider)
  );
  const unitType = new ContextObjectType(
    `${provider.id}:unit`,
    Types.contextObjectRef(),
    provider.unitMembers ?? emptyMembers(),
    unitFactory
  );
  const measureType = new ContextObjectType(
    `${provider.id}:measure`,
    Types.contextObjectRef(),
    provider.measureMembers ?? emptyMembers(),
    measureFactory
  );

  const unitMembers = new Map<string, BuiltinMemberDefinition>();
  const measureMembers = new Map<string, BuiltinMemberDefinition>();
  const unitValues: Record<string, unknown> = {};
  const measureValues: Record<string, unknown> = {};

  for (const name of IFC_PORTABLE_UNIT_NAMES) {
    const value = requirePortableCatalogEntry(
      provider.id,
      "unit",
      name,
      provider.resolveUnit(name)
    );
    unitMembers.set(name, { name, kind: "property", valueType: unitType });
    unitValues[name] = value;
  }
  for (const name of IFC_PORTABLE_MEASURE_NAMES) {
    const value = requirePortableCatalogEntry(
      provider.id,
      "measure",
      name,
      provider.resolveMeasure(name)
    );
    measureMembers.set(name, {
      name,
      kind: "property",
      valueType: measureType,
    });
    measureValues[name] = value;
  }

  unitMembers.set("CONVERT", {
    name: "convert",
    kind: "function",
    returnType: Types.numeric(),
    argumentTypes: [Types.numeric(), unitType, unitType],
  });
  unitMembers.set("ISCONVERTIBLE", {
    name: "isConvertible",
    kind: "function",
    returnType: Types.boolean(),
    argumentTypes: [unitType, unitType],
  });
  measureMembers.set("ISSUBKINDOF", {
    name: "isSubKindOf",
    kind: "function",
    returnType: Types.boolean(),
    argumentTypes: [measureType, measureType],
  });

  unitValues.convert = (value: unknown, from: Unit, to: Unit) =>
    provider.convert(toNumber(value), from, to);
  unitValues.isConvertible = (from: Unit, to: Unit) =>
    provider.isConvertible(from, to);
  measureValues.isSubKindOf = (actual: Measure, broader: Measure) =>
    provider.isSubKindOf(actual, broader);

  addCatalogs(
    provider.id,
    "unit",
    provider.unitCatalogs,
    unitType,
    unitMembers,
    unitValues
  );
  addCatalogs(
    provider.id,
    "measure",
    provider.measureCatalogs,
    measureType,
    measureMembers,
    measureValues
  );

  const unitRootType = new ContextObjectType(
    "$unit",
    Types.contextObjectRef(),
    unitMembers
  );
  const measureRootType = new ContextObjectType(
    "$measure",
    Types.contextObjectRef(),
    measureMembers
  );
  const builtinDefinitions: ReadonlyArray<BuiltinVariableDefinition> = [
    { name: "$unit", type: unitRootType },
    { name: "$measure", type: measureRootType },
  ];
  const builtinValues = { unit: unitValues, measure: measureValues };

  return {
    provider,
    unitType,
    measureType,
    builtinDefinitions,
    builtinValues,
    resolveBuiltinVariable(name: string): unknown {
      return builtinValues[name.replace(/^\$/, "").toLowerCase()];
    },
  };
}
