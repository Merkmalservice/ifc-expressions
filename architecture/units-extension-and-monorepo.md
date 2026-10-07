# Units extension and monorepo design

Status: draft  
Branch: `architecture/unit-modules`

## Purpose

Turn `ifc-expressions` into a pnpm monorepo and add optional, provider-backed unit support without coupling the expression engine to IFC's low-level unit representation or to `qudtlib`.

Existing expression strings used by live projects are a compatibility boundary. The migration and extensions must be additive wherever possible.

## Modules

The first independently publishable npm packages are:

| Package | Responsibility |
| --- | --- |
| `ifc-expressions` | Parser, compiler, evaluator, context-object infrastructure, operator extension mechanism, and autocomplete infrastructure. |
| `ifc-expressions-units` | Optional unit-language contract, `$unit` builtin specification, portable aliases, and provider interfaces. |
| `ifc-expressions-units-qudtlib` | Default/recommended implementation of the units extension using `qudtlib`, including the QUDT catalog. |

Proposed repository layout, following the working `ecotwin-js` conventions:

```text
/
├── package.json                 # private workspace root
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.base.json
├── architecture/
└── packages/
    ├── ifc-expressions/
    ├── ifc-expressions-units/
    └── ifc-expressions-units-qudtlib/
```

Each package owns its `package.json`, build, tests, exports, and publishable `dist` directory. Workspace scripts use recursive pnpm commands. Workspace packages use pnpm workspace dependencies during development and publish ordinary npm-compatible dependency ranges.

## Dependency direction

```text
ifc-expressions-units-qudtlib
            ↓
ifc-expressions-units
            ↓
ifc-expressions
```

`ifc-expressions` must remain usable without installing or configuring a unit provider. Without the units extension, `$unit` is unknown and unit-aware expressions fail during compilation.

The QUDT implementation is the default recommendation, but `ifc-expressions-units` must not statically depend on it because the implementation already depends on the contract. Applications compose and register the provider explicitly unless we introduce another packaging layer.

## Core context-object extension

Units and quantity kinds are not primitive expression types. Their runtime and public expression type remains `ContextObjectRef`.

Core gains a generic factory mechanism for nominal context objects. A factory:

- creates `ContextObjectValue` instances from provider-level objects;
- supplies stable nominal identity used by static typing;
- implements only the operators declared for that nominal context-object type;
- remains associated with every value it creates.

Static function signatures and member return types can therefore distinguish:

```text
ContextObjectRef<unit-factory>
ContextObjectRef<quantity-kind-factory>
ContextObjectRef<some-other-factory>
```

without adding `Type.UNIT` or `Type.QUANTITY_KIND`.

Operator support is declared at type/factory registration time and validated during expression compilation. Operator availability must never depend on an individual runtime value. The evaluator delegates the operation to the factory only after successful static validation.

For equality:

```text
ContextObjectRef<F> == ContextObjectRef<F> -> boolean
ContextObjectRef<F> != ContextObjectRef<F> -> boolean
```

is available only when factory `F` supports equality. `!=` is the negation of the same equality operation. Cross-factory equality is a compile-time error.

Legacy, non-factory context objects retain their current behavior so existing expression strings do not change meaning. New factory-backed types use the stricter nominal rules.

The same registered type metadata drives compilation and autocomplete. Unsupported operators and wrong factory types must be rejected before model evaluation.

## Units extension

`ifc-expressions-units` registers the optional `$unit` language surface and the unit and quantity-kind factory contracts.

Initial operations:

```text
$unit.convert(value, fromUnit, toUnit) -> numeric
$unit.isConvertible(fromUnit, toUnit) -> boolean
$unit.isSubKindOf(actualKind, broaderKind) -> boolean
```

Both unit arguments are `ContextObjectRef<unit-factory>`. Both quantity-kind arguments are `ContextObjectRef<quantity-kind-factory>`.

Example:

```text
$result.unit.isInheritedFromProject()
&& $result.unit == $unit.METRE
&& $unit.convert($result.value, $result.unit, $unit.METRE) > 1
```

Unit provenance is metadata on the expression-facing unit object, not part of unit identity. Catalog constants have no model provenance. Equality is provider-defined unit identity and ignores provenance.

The exact provenance member set remains to be finalized; the motivating predicates are `isInheritedFromProject()` and `isExplicitlySpecified()`.

## Provider ownership

The active unit provider exclusively owns:

- provider-level unit and quantity-kind objects;
- unit identity and equality;
- conversion and convertibility;
- quantity-kind hierarchy;
- mapping or constructing units from IFC input;
- catalogued and anonymous derived units.

An anonymous unit is a valid provider-level unit object without a public catalog constant. It is not a partial unit definition interpreted by `ifc-expressions-units`. If an IFC adapter cannot obtain a valid provider object, it must fail at that boundary rather than place an invalid unit in the expression context.

`ifc-expressions-units` must not implement dimensional algebra, scaling, offsets, or conversion fallbacks.

## Constants and catalogs

The optional units package may define a deliberately incomplete set of stable, provider-independent aliases for common IFC-facing usage:

```text
$unit.METRE
$unit.CENTI_METRE
$unit.KILO_GRAM
$unit.PASCAL
```

Their purpose is convenient, portable language for common cases, not catalog completeness. Every compatible provider must bind each standardized alias to a valid provider-level object.

The QUDT package exposes its substantially larger generated catalog with type-sensitive completion. Provider-specific names must be visibly namespaced; the exact namespace is still open, for example:

```text
$unit.QUDT.<generated-unit-name>
$unit.QUDT.QuantityKinds.<generated-kind-name>
```

Expressions using that namespace intentionally depend on the QUDT vocabulary, but not necessarily on `qudtlib` as an implementation substrate.

## Backwards compatibility

Compatibility applies first to expression strings and their meaning, then to the published package API.

Required gates:

- Existing grammar remains valid; no existing syntax is repurposed.
- Existing primitive and legacy context-object equality semantics remain unchanged.
- Existing builtins, case-insensitive names, functions, and member access remain available.
- Existing expression tests become a compatibility corpus and run unchanged after the package move.
- Add golden tests for parse success, inferred types, expression rendering, and evaluation results of representative live expressions.
- Keep the published package name `ifc-expressions` and its root export.
- Preserve current ESM and CommonJS entry points initially unless evidence shows they are unused and a separately planned major release removes one.
- Monorepo conversion must be structurally separate from semantic changes so regressions are attributable.
- The base package must not acquire a mandatory unit-provider dependency.

New context-object operators are additive. An expression such as `$result.unit == $unit.METRE` already fits the grammar; support requires type registration, compile-time validation, runtime dispatch, and completion rather than a grammar change.

## Delivery sequence

1. Capture compatibility tests before moving source files.
2. Convert the repository to a pnpm workspace while keeping `ifc-expressions` behavior unchanged.
3. Add generic nominal context-object factories and static factory-sensitive types.
4. Add factory-declared equality with compile-time rejection of unsupported operators.
5. Publish the provider-independent units extension contract.
6. Implement and test the QUDT provider and catalog completion.
7. Integrate IFC-unit resolution and provenance in consuming adapters.

## Open decisions

1. Does “default QUDT provider” mean recommended and explicitly registered, or must installing `ifc-expressions-units` automatically install/configure it? Automatic composition requires a different package split to avoid a dependency cycle.
2. Should the user-facing term be `quantityKind`, `measurement`, or another IFC-familiar term?
3. Which portable aliases are normative in `ifc-expressions-units`, and what compatibility/versioning policy governs additions?
4. What exact namespace exposes the complete QUDT unit and quantity-kind catalogs?
5. Should all three packages share one version, or be independently versioned and released?
6. Which current CommonJS and deep-import entry points are confirmed compatibility requirements beyond the documented root export?

