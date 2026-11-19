import assert from "node:assert/strict";
import test from "node:test";
import {
  BuiltinVariableRegistry,
  IfcExpression,
  IfcExpressionAutocomplete,
  IfcExpressionErrorListener,
  isExprEvalSuccess,
} from "ifc-expressions";
import { createIfcExpressionUnitsEnvironment } from "ifc-expressions-units";
import { QuantityKinds, Units, qudtUnitProvider } from "../dist/index.js";

const environment = createIfcExpressionUnitsEnvironment(qudtUnitProvider);
const registry = new BuiltinVariableRegistry(environment.builtinDefinitions);
const context = {
  resolveElemRef() {
    throw new Error("not used");
  },
  resolvePropRef() {
    throw new Error("not used");
  },
  resolveBuiltinVariable(name) {
    return environment.resolveBuiltinVariable(name);
  },
};

function evaluate(expression) {
  return IfcExpression.evaluate(expression, context, {
    builtinVariableRegistry: registry,
  });
}

test("binds every required IFC4X3_ADD2 portable alias", () => {
  assert.ok(environment.builtinValues.unit.METRE);
  assert.ok(environment.builtinValues.unit.KILO_GRAM);
  assert.ok(environment.builtinValues.unit.ATTO_WEBER);
  assert.ok(environment.builtinValues.measure.LENGTH);
  assert.ok(environment.builtinValues.measure.VOLUMETRICFLOWRATE);
});

test("converts QUDT-backed portable units", () => {
  const result = evaluate(
    "$unit.convert(100, $unit.CENTI_METRE, $unit.METRE) == 1 && $unit.convert(1, $unit.KILO_GRAM, $unit.GRAM) == 1000"
  );
  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
});

test("constructs valid QUDT-level objects for IFC-prefixed units absent from the QUDT catalog", () => {
  const result = evaluate(
    "$unit.convert(100, $unit.CENTI_AMPERE, $unit.AMPERE) == 1"
  );
  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
});

test("uses QUDT identity and quantity-kind hierarchy operations", () => {
  const result = evaluate(
    "$unit.METRE == $unit.METRE && $measure.isSubKindOf($measure.LENGTH, $measure.LENGTH)"
  );
  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
});

test("exposes literal QUDT unit and measure constants", () => {
  const result = evaluate(
    "$unit.QUDT.M == $unit.METRE && $measure.QUDT.Length == $measure.LENGTH"
  );
  assert.equal(isExprEvalSuccess(result), true);
  assert.equal(result.result.getValue(), true);
});

test("provides bounded, case-sensitive completion for the QUDT catalogs", () => {
  const result = IfcExpressionAutocomplete.complete("$unit.QUDT.", 11, {
    builtinVariableRegistry: registry,
  });
  assert.equal(result.items.length, 100);
  assert.equal(result.isIncomplete, true);

  const upperCaseNames = IfcExpressionAutocomplete.complete(
    "$unit.QUDT.CI",
    13,
    { builtinVariableRegistry: registry }
  ).items.map((item) => item.label);
  const mixedCaseNames = IfcExpressionAutocomplete.complete(
    "$unit.QUDT.Ci",
    13,
    { builtinVariableRegistry: registry }
  ).items.map((item) => item.label);
  assert.ok(upperCaseNames.includes("CI"));
  assert.ok(!upperCaseNames.includes("Ci"));
  assert.ok(mixedCaseNames.includes("Ci"));
  assert.ok(!mixedCaseNames.includes("CI"));

  const wrongCase = evaluate("$unit.QUDT.ci == $unit.QUDT.Ci");
  assert.equal(isExprEvalSuccess(wrongCase), false);
});

test("accepts every literal QUDT constant name in the expression grammar", () => {
  for (const [root, names] of [
    ["unit", Object.keys(Units)],
    ["measure", Object.keys(QuantityKinds)],
  ]) {
    for (const name of names) {
      const listener = new IfcExpressionErrorListener();
      IfcExpression.parse(`$${root}.QUDT.${name}`, listener, {
        builtinVariableRegistry: registry,
      });
      assert.equal(listener.isErrorOccurred(), false, `$${root}.QUDT.${name}`);
    }
  }
});
