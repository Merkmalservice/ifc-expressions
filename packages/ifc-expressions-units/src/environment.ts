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
import {
  createIfcExpressionUnitReference,
  IfcExpressionUnitProvenance,
  IfcExpressionUnitReference,
  isIfcExpressionUnitReference,
} from "./unit-reference.js";

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
  createUnitReference(
    unit: Unit,
    provenance: IfcExpressionUnitProvenance
  ): IfcExpressionUnitReference<Unit>;
  createProjectUnit(unit: Unit): IfcExpressionUnitReference<Unit>;
  createExplicitUnit(unit: Unit): IfcExpressionUnitReference<Unit>;
  createDefaultUnit(unit: Unit): IfcExpressionUnitReference<Unit>;
  createCalculatedUnit(unit: Unit): IfcExpressionUnitReference<Unit>;
  createUnknownUnit(unit: Unit): IfcExpressionUnitReference<Unit>;
  resolveBuiltinVariable(name: string): unknown;
};

class UnitValueFactory<Unit extends object>
  implements ContextObjectTypeFactory<IfcExpressionUnitReference<Unit>>
{
  constructor(
    private readonly provider: IfcExpressionUnitProvider<Unit, any>,
    private readonly referenceOwner: object
  ) {}

  createValue(
    value: IfcExpressionUnitReference<Unit>,
    type: ContextObjectType
  ): ContextObjectValue<IfcExpressionUnitReference<Unit>> {
    if (!isIfcExpressionUnitReference<Unit>(value, this.referenceOwner)) {
      throw new TypeError(
        "Unit context values must be created by the active ifc-expressions-units environment."
      );
    }
    return new ContextObjectValue(value, type);
  }

  getBinaryOperator(operator: ContextObjectOperator) {
    return operator === ContextObjectOperator.EQUALS
      ? (
          left: IfcExpressionUnitReference<Unit>,
          right: IfcExpressionUnitReference<Unit>
        ) => this.provider.unitsEqual(left.providerUnit, right.providerUnit)
      : undefined;
  }
}

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

class CompositeMemberProvider implements ContextObjectMemberProvider {
  constructor(
    private readonly providers: ReadonlyArray<ContextObjectMemberProvider>
  ) {}

  getMemberDefinition(name: string): BuiltinMemberDefinition | undefined {
    for (const provider of this.providers) {
      const definition = provider.getMemberDefinition(name);
      if (definition) {
        return definition;
      }
    }
    return undefined;
  }

  completeMembers(prefix: string, limit: number) {
    const definitions: Array<BuiltinMemberDefinition> = [];
    const names = new Set<string>();
    let isIncomplete = false;
    for (const provider of this.providers) {
      const remaining = Math.max(0, limit - definitions.length);
      const completion = provider.completeMembers(prefix, remaining);
      isIncomplete ||= completion.isIncomplete === true;
      for (const definition of completion.definitions) {
        const normalizedName = definition.name.toUpperCase();
        if (!names.has(normalizedName) && definitions.length < limit) {
          names.add(normalizedName);
          definitions.push(definition);
        } else if (!names.has(normalizedName)) {
          isIncomplete = true;
        }
      }
    }
    return { definitions, isIncomplete: isIncomplete || undefined };
  }
}

function catalogRuntimeValue<T extends object, R extends object>(
  catalog: IfcExpressionValueCatalog<T>,
  toRuntimeValue: (value: T) => R
): Record<string, unknown> {
  return new Proxy(
    {},
    {
      get(_target, property) {
        if (typeof property !== "string") {
          return undefined;
        }
        const value = catalog.resolve(property);
        return value ? toRuntimeValue(value) : undefined;
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

function addCatalogs<T extends object, R extends object>(
  providerId: string,
  kind: "unit" | "measure",
  catalogs: ReadonlyArray<IfcExpressionValueCatalog<T>> | undefined,
  valueType: ContextObjectType,
  rootMembers: Map<string, BuiltinMemberDefinition>,
  rootValues: Record<string, unknown>,
  toRuntimeValue: (value: T) => R
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
    rootValues[catalog.name] = catalogRuntimeValue(catalog, toRuntimeValue);
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

  const unitReferenceOwner = {};
  const unitFactory = new UnitValueFactory(provider, unitReferenceOwner);
  const measureFactory = new ProviderValueFactory(
    provider.measuresEqual.bind(provider)
  );
  const unitValueMembers = new Map<string, BuiltinMemberDefinition>([
    [
      "ISPROJECTUNIT",
      {
        name: "isProjectUnit",
        kind: "function",
        returnType: Types.boolean(),
        argumentTypes: [],
      },
    ],
    [
      "ISEXPLICITUNIT",
      {
        name: "isExplicitUnit",
        kind: "function",
        returnType: Types.boolean(),
        argumentTypes: [],
      },
    ],
    [
      "ISDEFAULTUNIT",
      {
        name: "isDefaultUnit",
        kind: "function",
        returnType: Types.boolean(),
        argumentTypes: [],
      },
    ],
  ]);
  const unitMemberProviders: Array<ContextObjectMemberProvider> = [
    new MapContextObjectMemberProvider(unitValueMembers),
  ];
  if (provider.unitMembers) {
    unitMemberProviders.push(provider.unitMembers);
  }
  const unitType = new ContextObjectType(
    `${provider.id}:unit`,
    Types.contextObjectRef(),
    new CompositeMemberProvider(unitMemberProviders),
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

  for (const name of IFC_PORTABLE_UNIT_NAMES) {
    const value = requirePortableCatalogEntry(
      provider.id,
      "unit",
      name,
      provider.resolveUnit(name)
    );
    unitMembers.set(name, { name, kind: "property", valueType: unitType });
    unitValues[name] = createIfcExpressionUnitReference(
      value,
      IfcExpressionUnitProvenance.CATALOG,
      unitReferenceOwner
    );
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

  unitValues.convert = (
    value: unknown,
    from: IfcExpressionUnitReference<Unit>,
    to: IfcExpressionUnitReference<Unit>
  ) => provider.convert(toNumber(value), from.providerUnit, to.providerUnit);
  unitValues.isConvertible = (
    from: IfcExpressionUnitReference<Unit>,
    to: IfcExpressionUnitReference<Unit>
  ) => provider.isConvertible(from.providerUnit, to.providerUnit);
  measureValues.isSubKindOf = (actual: Measure, broader: Measure) =>
    provider.isSubKindOf(actual, broader);

  addCatalogs(
    provider.id,
    "unit",
    provider.unitCatalogs,
    unitType,
    unitMembers,
    unitValues,
    (unit) =>
      createIfcExpressionUnitReference(
        unit,
        IfcExpressionUnitProvenance.CATALOG,
        unitReferenceOwner
      )
  );
  addCatalogs(
    provider.id,
    "measure",
    provider.measureCatalogs,
    measureType,
    measureMembers,
    measureValues,
    (measure) => measure
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
    createUnitReference(unit: Unit, provenance: IfcExpressionUnitProvenance) {
      return createIfcExpressionUnitReference(
        unit,
        provenance,
        unitReferenceOwner
      );
    },
    createProjectUnit(unit: Unit) {
      return createIfcExpressionUnitReference(
        unit,
        IfcExpressionUnitProvenance.PROJECT,
        unitReferenceOwner
      );
    },
    createExplicitUnit(unit: Unit) {
      return createIfcExpressionUnitReference(
        unit,
        IfcExpressionUnitProvenance.EXPLICIT,
        unitReferenceOwner
      );
    },
    createDefaultUnit(unit: Unit) {
      return createIfcExpressionUnitReference(
        unit,
        IfcExpressionUnitProvenance.DEFAULT,
        unitReferenceOwner
      );
    },
    createCalculatedUnit(unit: Unit) {
      return createIfcExpressionUnitReference(
        unit,
        IfcExpressionUnitProvenance.CALCULATED,
        unitReferenceOwner
      );
    },
    createUnknownUnit(unit: Unit) {
      return createIfcExpressionUnitReference(
        unit,
        IfcExpressionUnitProvenance.UNKNOWN,
        unitReferenceOwner
      );
    },
    resolveBuiltinVariable(name: string): unknown {
      return builtinValues[name.replace(/^\$/, "").toLowerCase()];
    },
  };
}
