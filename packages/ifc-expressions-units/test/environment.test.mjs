import assert from "node:assert/strict";
import test from "node:test";
import {
  BuiltinVariableRegistry,
  ContextObjectType,
  IfcExpression,
  IfcExpressionAutocomplete,
  Types,
  isExprEvalSuccess,
} from "ifc-expressions";
import {
  createIfcExpressionUnitsEnvironment,
  IFC_PORTABLE_MEASURE_NAMES,
  IFC_PORTABLE_UNIT_NAMES,
  IfcExpressionUnitProvenance,
  IfcExpressionUnitsConfigurationError,
} from "../dist/index.js";

const prefixFactors = new Map([
  ["ATTO", 1e-18],
  ["CENTI", 1e-2],
  ["DECA", 1e1],
  ["DECI", 1e-1],
  ["EXA", 1e18],
  ["FEMTO", 1e-15],
  ["GIGA", 1e9],
  ["HECTO", 1e2],
  ["KILO", 1e3],
  ["MEGA", 1e6],
  ["MICRO", 1e-6],
  ["MILLI", 1e-3],
  ["NANO", 1e-9],
  ["PETA", 1e15],
  ["PICO", 1e-12],
  ["TERA", 1e12],
]);

function unitFor(name) {
  const prefix = [...prefixFactors.keys()].find((candidate) =>
    name.startsWith(`${candidate}_`)
  );
  return {
    name,
    base: prefix ? name.slice(prefix.length + 1) : name,
    factor: prefix ? prefixFactors.get(prefix) : 1,
  };
}

function mockProvider() {
  const units = new Map(
    IFC_PORTABLE_UNIT_NAMES.map((name) => [name, unitFor(name)])
  );
  const measures = new Map(
    IFC_PORTABLE_MEASURE_NAMES.map((name) => [name, { name }])
  );
  return {
    id: "mock",
    resolveUnit: (name) => units.get(name),
    resolveMeasure: (name) => measures.get(name),
    unitsEqual: (left, right) => left.name === right.name,
    measuresEqual: (left, right) => left.name === right.name,
    convert: (value, from, to) => value * (from.factor / to.factor),
    isConvertible: (from, to) => from.base === to.base,
    isSubKindOf: (actual, broader) => actual.name === broader.name,
  };
}

function evaluate(expression, environment) {
  const registry = new BuiltinVariableRegistry(environment.builtinDefinitions);
  return IfcExpression.evaluate(
    expression,
    {
      resolveElemRef() {
        throw new Error("not used");
      },
      resolvePropRef() {
        throw new Error("not used");
      },
      resolveBuiltinVariable(name) {
        return environment.resolveBuiltinVariable(name);
      },
    },
    { builtinVariableRegistry: registry }
  );
}

function evaluateWithDefinitions(expression, environment, definitions, values) {
  const registry = new BuiltinVariableRegistry([
    ...environment.builtinDefinitions,
    ...definitions,
  ]);
  return IfcExpression.evaluate(
    expression,
    {
      resolveElemRef() {
        throw new Error("not used");
      },
      resolvePropRef() {
        throw new Error("not used");
      },
      resolveBuiltinVariable(name) {
        return (
          values[name.replace(/^\$/, "").toLowerCase()] ??
          environment.resolveBuiltinVariable(name)
        );
      },
    },
    { builtinVariableRegistry: registry }
  );
}

test("fails immediately with an actionable error when no provider is supplied", () => {
  assert.throws(
    () => createIfcExpressionUnitsEnvironment(undefined),
    (error) =>
      error instanceof IfcExpressionUnitsConfigurationError &&
      error.message.includes("ifc-expressions-units-qudtlib")
  );
});

test("rejects providers that omit a required portable alias", () => {
  const provider = mockProvider();
  provider.resolveUnit = () => undefined;
  assert.throws(
    () => createIfcExpressionUnitsEnvironment(provider),
    /required portable unit 'AMPERE'/
  );
});

test("rejects incomplete provider capabilities and duplicate catalogs", () => {
  const incomplete = mockProvider();
  incomplete.convert = undefined;
  assert.throws(
    () => createIfcExpressionUnitsEnvironment(incomplete),
    /missing capabilities: convert/
  );

  const duplicateCatalogs = mockProvider();
  const catalog = {
    name: "QUDT",
    resolve: () => undefined,
    complete: () => ({ names: [] }),
  };
  duplicateCatalogs.unitCatalogs = [catalog, catalog];
  assert.throws(
    () => createIfcExpressionUnitsEnvironment(duplicateCatalogs),
    /duplicate or invalid unit catalog name 'QUDT'/
  );
});

test("provides typed portable units, conversion, and equality", () => {
  const environment = createIfcExpressionUnitsEnvironment(mockProvider());
  const result = evaluate(
    "$unit.convert(100, $unit.CENTI_METRE, $unit.METRE) == 1 && $unit.METRE == $unit.METRE",
    environment
  );
  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
});

test("provides typed portable measures and rejects unit/measure equality", () => {
  const environment = createIfcExpressionUnitsEnvironment(mockProvider());
  const success = evaluate("$measure.LENGTH == $measure.LENGTH", environment);
  assert.equal(isExprEvalSuccess(success), true);
  assert.equal(success.result.getValue(), true);

  const mismatch = evaluate("$unit.METRE == $measure.LENGTH", environment);
  assert.equal(isExprEvalSuccess(mismatch), false);
});

test("carries occurrence provenance without changing unit identity", () => {
  const provider = mockProvider();
  const environment = createIfcExpressionUnitsEnvironment(provider);
  const metre = provider.resolveUnit("METRE");
  const concreteMembers = new Map([
    [
      "UNIT",
      { name: "unit", kind: "property", valueType: environment.unitType },
    ],
  ]);
  const resultType = new ContextObjectType(
    "$result",
    Types.contextObjectRef(),
    concreteMembers
  );

  const projectUnit = environment.createProjectUnit(metre);
  const explicitUnit = environment.createExplicitUnit(metre);
  const calculatedUnit = environment.createCalculatedUnit(metre);
  const unknownUnit = environment.createUnknownUnit(metre);
  const definitions = [
    { name: "$projectResult", type: resultType },
    { name: "$explicitResult", type: resultType },
    { name: "$calculatedResult", type: resultType },
  ];
  const values = {
    projectresult: { unit: projectUnit },
    explicitresult: { unit: explicitUnit },
    calculatedresult: { unit: calculatedUnit },
  };
  const result = evaluateWithDefinitions(
    [
      "$projectResult.unit.isProjectUnit()",
      "!$projectResult.unit.isExplicitUnit()",
      "$explicitResult.unit.isExplicitUnit()",
      "!$explicitResult.unit.isProjectUnit()",
      "!$calculatedResult.unit.isProjectUnit()",
      "!$calculatedResult.unit.isExplicitUnit()",
      "!$unit.METRE.isProjectUnit()",
      "!$unit.METRE.isExplicitUnit()",
      "$projectResult.unit == $explicitResult.unit",
      "$calculatedResult.unit == $unit.METRE",
    ].join(" && "),
    environment,
    definitions,
    values
  );

  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
  assert.equal(projectUnit.provenance, IfcExpressionUnitProvenance.PROJECT);
  assert.equal(explicitUnit.provenance, IfcExpressionUnitProvenance.EXPLICIT);
  assert.equal(
    calculatedUnit.provenance,
    IfcExpressionUnitProvenance.CALCULATED
  );
  assert.equal(
    environment.builtinValues.unit.METRE.provenance,
    IfcExpressionUnitProvenance.CATALOG
  );
  assert.equal(unknownUnit.provenance, IfcExpressionUnitProvenance.UNKNOWN);
  assert.equal(unknownUnit.isProjectUnit(), false);
  assert.equal(unknownUnit.isExplicitUnit(), false);

  const otherEnvironment = createIfcExpressionUnitsEnvironment(provider);
  assert.throws(
    () => otherEnvironment.unitType.createValue(projectUnit),
    /active ifc-expressions-units environment/
  );
});

test("uses the same unit type for directly and transitively reached IFC properties", () => {
  const provider = mockProvider();
  const environment = createIfcExpressionUnitsEnvironment(provider);
  const explicitUnit = environment.createExplicitUnit(
    provider.resolveUnit("CENTI_METRE")
  );
  const propertyType = new ContextObjectType(
    "test-property",
    Types.contextObjectRef(),
    new Map([
      [
        "UNIT",
        { name: "unit", kind: "property", valueType: environment.unitType },
      ],
    ])
  );
  const propertySetType = new ContextObjectType(
    "test-property-set",
    Types.contextObjectRef(),
    new Map([
      [
        "PROPERTY",
        {
          name: "property",
          kind: "function",
          returnType: propertyType,
          argumentTypes: [Types.string()],
        },
      ],
    ])
  );
  const elementType = new ContextObjectType(
    "test-element",
    Types.contextObjectRef(),
    new Map([
      [
        "PROPERTYSET",
        {
          name: "propertySet",
          kind: "function",
          returnType: propertySetType,
          argumentTypes: [Types.string()],
        },
      ],
    ])
  );
  const property = { unit: explicitUnit };
  const values = {
    property,
    element: { propertySet: () => ({ property: () => property }) },
  };
  const result = evaluateWithDefinitions(
    "$property.unit.isExplicitUnit() && $element.propertySet('Pset').property('Length').unit.isExplicitUnit()",
    environment,
    [
      { name: "$property", type: propertyType },
      { name: "$element", type: elementType },
    ],
    values
  );

  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
});

test("offers the standardized provenance predicates in unit completion", () => {
  const environment = createIfcExpressionUnitsEnvironment(mockProvider());
  const registry = new BuiltinVariableRegistry(environment.builtinDefinitions);
  const expression = "$unit.METRE.is";
  const labels = IfcExpressionAutocomplete.complete(
    expression,
    expression.length,
    { builtinVariableRegistry: registry }
  ).items.map((item) => item.label);

  assert.ok(labels.includes("isProjectUnit"));
  assert.ok(labels.includes("isExplicitUnit"));
});

test("keeps helper functions visible in unfiltered root completion", () => {
  const environment = createIfcExpressionUnitsEnvironment(mockProvider());
  const registry = new BuiltinVariableRegistry(environment.builtinDefinitions);

  const unitCompletion = IfcExpressionAutocomplete.complete("$unit.", 6, {
    builtinVariableRegistry: registry,
  });
  const measureCompletion = IfcExpressionAutocomplete.complete("$measure.", 9, {
    builtinVariableRegistry: registry,
  });

  assert.ok(unitCompletion.items.some((item) => item.label === "convert"));
  assert.ok(
    unitCompletion.items.some((item) => item.label === "isConvertible")
  );
  assert.ok(
    measureCompletion.items.some((item) => item.label === "isSubKindOf")
  );
});
