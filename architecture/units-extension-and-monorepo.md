# Units extension and monorepo design

Status: draft

Branch: `architecture/unit-modules`

## Purpose

Turn `ifc-expressions` into a pnpm monorepo and add optional, provider-backed unit support without coupling the expression engine to IFC's low-level unit representation or to `qudtlib`.

Existing expression strings used by live projects are a compatibility boundary. The migration and extensions must be additive wherever possible.

## Modules

The first independently publishable npm packages are:

| Package                         | Responsibility                                                                                                             |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ifc-expressions`               | Parser, compiler, evaluator, context-object infrastructure, operator extension mechanism, and autocomplete infrastructure. |
| `ifc-expressions-units`         | Optional unit-language contract, `$unit` builtin specification, portable aliases, and provider interfaces.                 |
| `ifc-expressions-units-qudtlib` | Default/recommended implementation of the units extension using `qudtlib`, including the QUDT catalog.                     |

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

The three packages are versioned and released independently. Dependency ranges express compatibility between their independently evolving APIs.

## Dependency direction

```text
ifc-expressions-units-qudtlib
            ↓
ifc-expressions-units
            ↓
ifc-expressions
```

`ifc-expressions` must remain usable without installing or configuring a unit provider. Without the units extension, `$unit` is unknown and unit-aware expressions fail during compilation.

The QUDT implementation is the default recommendation, but `ifc-expressions-units` does not statically depend on it because the implementation already depends on the contract. Applications install and register a provider explicitly.

Initializing the units extension without a provider is a fatal configuration error. Validation happens when the language environment is assembled, before expressions are compiled or evaluated. The error must name the missing capability and give an actionable remedy, for example:

```text
ifc-expressions-units requires a unit provider.
Install ifc-expressions-units-qudtlib and register its provider,
or register another compatible unit provider.
```

An environment accepts exactly one active unit provider unless a future design introduces explicit provider selection. Missing, duplicate, or incomplete provider registrations fail during initialization. Provider registration also validates all required portable aliases and operations.

## Core context-object extension

Units and measures are not primitive expression types. Their runtime and public expression type remains `ContextObjectRef`.

Core gains a generic factory mechanism for nominal context objects. A factory:

- creates `ContextObjectValue` instances from provider-level objects;
- supplies stable nominal identity used by static typing;
- implements only the operators declared for that nominal context-object type;
- remains associated with every value it creates.

Static function signatures and member return types can therefore distinguish:

```text
ContextObjectRef<unit-factory>
ContextObjectRef<measure-factory>
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

### Catalog member resolution and autocomplete

`ContextObjectType` must accept a member provider in addition to the existing eager member map. The provider performs exact member resolution for compilation and prefix-based completion for the editor. Existing member arrays are wrapped by a map-backed provider for compatibility.

Generated catalogs are resolved lazily. Completion receives names, documentation, and static return types; it does not instantiate provider-level unit or measure objects. Runtime evaluation resolves the selected member through the same catalog registration.

Large catalogs return a bounded, prefix-filtered result and may mark it incomplete so the editor requests completion again for a narrower prefix. Compilation always performs unbounded exact-name lookup. The packaged QUDT catalog remains synchronous; remote providers must preload their metadata during extension initialization.

## Units extension

`ifc-expressions-units` registers two optional top-level language surfaces and their factory contracts:

- `$unit` for units, conversion, and convertibility;
- `$measure` for measures and their hierarchy.

Initial operations:

```text
$unit.convert(value, fromUnit, toUnit) -> numeric
$unit.isConvertible(fromUnit, toUnit) -> boolean
$measure.isSubKindOf(actualMeasure, broaderMeasure) -> boolean
```

Both unit arguments are `ContextObjectRef<unit-factory>`. Both measure arguments are `ContextObjectRef<measure-factory>`.

Example:

```text
$result.unit.isInheritedFromProject()
&& $result.unit == $unit.METRE
&& $result.measure == $measure.LENGTH
&& $unit.convert($result.value, $result.unit, $unit.METRE) > 1
```

Unit provenance is metadata on the expression-facing unit object, not part of unit identity. Catalog constants have no model provenance. Equality is provider-defined unit identity and ignores provenance.

The exact provenance member set remains to be finalized; the motivating predicates are `isInheritedFromProject()` and `isExplicitlySpecified()`.

## Provider ownership

The active unit provider exclusively owns:

- provider-level unit and measure objects;
- unit identity and equality;
- conversion and convertibility;
- measure hierarchy;
- mapping or constructing units from IFC input;
- catalogued and anonymous derived units.

An anonymous unit is a valid provider-level unit object without a public catalog constant. It is not a partial unit definition interpreted by `ifc-expressions-units`. If an IFC adapter cannot obtain a valid provider object, it must fail at that boundary rather than place an invalid unit in the expression context.

`ifc-expressions-units` must not implement dimensional algebra, scaling, offsets, or conversion fallbacks.

## Constants and catalogs

The optional units package defines a deliberately incomplete set of stable, provider-independent aliases generated from the official IFC4X3_ADD2 (IFC 4.3.2.0) schema:

```text
$unit.METRE
$unit.CENTI_METRE
$unit.KILO_GRAM
$unit.PASCAL
```

Their purpose is convenient, portable language for common cases, not catalog completeness. Every compatible provider must bind each standardized alias to a valid provider-level object. Generation records and pins the exact IFC 4.3 schema revision used for reproducible releases; updating to newer IFC 4.3 constants is an explicit package change.

Portable unit names are the Cartesian product of `IfcSIUnitName` and an optional `IfcSIPrefix`, joined with `_`. Portable measure names combine `IfcUnitEnum` and `IfcDerivedUnitEnum`, remove the trailing `UNIT`, and exclude `USERDEFINED`. The normative source URLs are exported with the generated catalogs.

The QUDT package exposes its substantially larger generated catalogs with type-sensitive completion under explicit provider namespaces:

```text
$unit.QUDT.<generated-unit-name>
$measure.QUDT.<generated-measure-name>
```

Expressions using that namespace intentionally depend on the QUDT vocabulary, but not necessarily on `qudtlib` as an implementation substrate.

The provider exposes QUDT's generated JavaScript constant names literally. QUDT catalog namespaces are case-sensitive even though legacy builtin and function lookup remains case-insensitive. Provider tests enumerate every exported unit and quantity-kind constant and fail if a name cannot be tokenized by the expression grammar, collides with another exposed name, or cannot be resolved back to its provider object. Reserved literal tokens are accepted as member names after `.`, so constants such as `$unit.QUDT.UNKNOWN` remain expressible without changing standalone `UNKNOWN` behavior.

Verification against `@qudtlib/allunits` 7.1.0 passes all 3,076 unit keys and all 1,208 quantity-kind keys through the expression parser. The `UNKNOWN` unit key requires reserved tokens to be accepted in member-name position. Ten unit-key groups collide when normalized case-insensitively, including `CI`/`Ci` and `GAMMA`/`Gamma`; literal case-sensitive lookup is therefore required.

Portable aliases and provider constants resolve to objects from the same factories, so these comparisons are valid and true when the aliases denote the same concepts:

```text
$unit.METRE == $unit.QUDT.M
$measure.LENGTH == $measure.QUDT.Length
```

Unit-to-measure comparisons are rejected during compilation because the operands belong to different nominal context-object factories.

## Backwards compatibility

Compatibility applies first to expression strings and their meaning, then to the published package API.

Required gates:

- Existing grammar remains valid; no existing syntax is repurposed.
- Existing primitive and legacy context-object equality semantics remain unchanged.
- Existing builtins, case-insensitive names, functions, and member access remain available.
- Existing expression tests become a compatibility corpus and run unchanged after the package move.
- Add golden tests for parse success, inferred types, expression rendering, and evaluation results of representative live expressions.
- Keep the published package name `ifc-expressions` and its root export.
- Preserve all named exports currently available from the package root.
- Preserve current ESM and CommonJS entry points initially unless evidence shows they are unused and a separately planned major release removes one.
- No supported deep-import entry points are currently known; the existing package export map exposes only `"."`.
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

1. What is the final standardized unit-provenance member set beyond the motivating predicates?
