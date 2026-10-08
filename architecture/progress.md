# Architecture progress tracker

Updated: 2026-10-08

Branch: `architecture/unit-modules`

## Current milestone: architecture baseline

- [x] Create an isolated feature branch and worktree.
- [x] Inspect the current package, context-object type, equality, builtin, and completion structure.
- [x] Inspect the `ecotwin-js` pnpm workspace conventions.
- [x] Draft the monorepo and units-extension specification.
- [x] Record backwards compatibility as a hard constraint.
- [x] Resolve the open architecture decisions with the maintainer.
- [x] Approve this design before moving source files.

## Phase 1: compatibility baseline

- [x] Inventory public root exports and any supported deep imports.
- [x] Capture current npm package contents and ESM/CommonJS resolution behavior.
- [x] Identify representative expression strings from the existing live-project-oriented corpus.
- [x] Preserve the existing parsing, typing, rendering, and evaluation compatibility suite.
- [x] Record current legacy `ContextObjectValue` equality behavior.
- [x] Preserve Node.js `>=14.16` as the declared package baseline and test CI on Node.js 20.

Exit criterion: the existing package can be rebuilt and its expression compatibility suite is green before and after relocation.

## Phase 2: pnpm monorepo migration

- [x] Add private root `package.json` with recursive build, test, typecheck, and formatting scripts.
- [x] Add `pnpm-workspace.yaml`, lockfile, and shared TypeScript configuration.
- [x] Move the current package into `packages/ifc-expressions` without semantic changes.
- [x] Preserve `ifc-expressions` package name, exports, and publishable files.
- [x] Add empty package skeletons for `ifc-expressions-units` and `ifc-expressions-units-qudtlib`.
- [x] Add independent package build and typecheck scripts.
- [x] Update CI to build/test all packages and publish a selected package independently.
- [x] Verify package archive contents for every package.

Exit criterion: all three packages build independently and the relocated base package passes the compatibility suite unchanged.

## Phase 3: generic context-object factories

- [x] Specify the minimal `ContextObjectTypeFactory` contract.
- [x] Add nominal factory identity to static context-object types.
- [x] Associate factory identity with created `ContextObjectValue` instances.
- [x] Extend function arguments and return types to retain factory identity.
- [x] Drive member completion and signature help from the same static metadata.
- [x] Add lazy exact-resolution and prefix-completion providers for large nested catalogs.
- [x] Preserve case-insensitive legacy members while allowing case-sensitive provider catalogs.
- [x] Preserve the existing builtin registry API through compatibility adapters.
- [x] Avoid global factory registration; environment-owned factory instances make duplicate registration impossible, while builtin and catalog names are validated at configuration time.

Exit criterion: two distinct context-object factories are statically distinguishable without adding primitive expression types.

## Phase 4: context-object operators

- [x] Define static operator signatures for factory-backed context objects.
- [x] Implement equality dispatch through the common factory.
- [x] Derive `!=` from equality.
- [x] Reject unsupported and cross-factory operators during expression compilation.
- [x] Preserve legacy context-object reference equality.
- [x] Add operator-aware diagnostics where applicable; completion is not applicable to infix equality.

Exit criterion: supported comparisons compile and evaluate; unsupported comparisons never reach runtime.

## Phase 5: units extension

- [x] Define unit and measure factory contracts as context-object specializations.
- [x] Register the optional `$unit` and `$measure` builtins and typed operations.
- [x] Use separate `$unit` and `$measure` top-level objects rather than an umbrella namespace.
- [x] Specify unit provenance predicates on occurrence-level unit references.
- [x] Generate portable aliases from the pinned IFC4X3_ADD2 (IFC 4.3.2.0) schema revision.
- [x] Test that the base package works without any unit extension installed.
- [x] Fail units-extension initialization with actionable diagnostics when no provider is registered.
- [x] Reject duplicate or incomplete unit-provider registrations during initialization.

Exit criterion: a mock provider can supply units, measures, equality, conversion, hierarchy, provenance, and aliases with full static checking and completion.

## Phase 6: QUDT provider

- [x] Select and pin `@qudtlib/allunits` 7.1.0.
- [x] Implement provider-owned unit identity, equality, conversion, and compatibility.
- [x] Implement provider-owned measure identity and hierarchy.
- [x] Support valid provider objects for uncatalogued/anonymous derived units.
- [x] Lazily expose the full QUDT catalog with bounded completion.
- [x] Expose generated QUDT JavaScript constant names literally.
- [x] Exhaustively test QUDT constant names against the lexer, case-sensitive lookup, collisions, and runtime resolution.
- [x] Bind every portable alias to a QUDT provider object.
- [x] Keep provider installation and registration explicit; do not introduce an automatic dependency from the units contract to QUDT.

Exit criterion: QUDT-backed expressions work for portable aliases, the full catalog, and anonymous IFC-derived units without conversion logic in the base or units-contract packages.

## Phase 7: consuming-project integration

- [ ] Extend result/query context registrations with typed unit and measure references.
- [ ] Preserve explicit versus inherited project-unit provenance.
- [ ] Add the motivating thickness-reinterpretation filter as an integration test.
- [ ] Verify that correct model units continue to be treated as the source of truth.
- [ ] Add diagnostics for provider-resolution failures.

Exit criterion: the original `ET_IH-Dicke` case can be detected and explicitly repaired by a filter without changing generic IFC unit interpretation.

## Decision log

- 2026-10-07: Units and measures remain factory-backed `ContextObjectRef` values, not primitive expression types.
- 2026-10-07: Unit conversion, identity, compatibility, hierarchy, and anonymous-unit construction belong exclusively to the unit provider.
- 2026-10-07: Unit support is optional for `ifc-expressions`; the generic context-object factory/operator mechanism belongs in the base package.
- 2026-10-07: `ifc-expressions-units` requires an explicitly registered provider and fails during initialization with an actionable error when it is missing; provider installation is not automatic.
- 2026-10-07: Expose units and measures through separate `$unit` and `$measure` top-level objects; provider catalogs live under `$unit.<provider>` and `$measure.<provider>`.
- 2026-10-07: Generate the portable alias set from the latest stable IFC 4.3 constants, pinning the exact source revision per release.
- 2026-10-07: Expose QUDT-generated JavaScript constant names literally under case-sensitive provider namespaces, guarded by exhaustive compatibility tests.
- 2026-10-08: Verified all 3,076 unit keys and 1,208 quantity-kind keys from `@qudtlib/allunits` 7.1.0 through the expression parser; `UNKNOWN` required reserved tokens to be allowed specifically in member-name position, and ten unit-key groups require case-sensitive lookup.
- 2026-10-07: Version and release the three packages independently.
- 2026-10-07: Preserve the package-root exports and root CommonJS entry initially; no supported deep-import surface is currently known.
- 2026-10-07: Preserve Node.js `>=14.16` in published package metadata; use Node.js 20 for workspace CI.
- 2026-10-07: Complete the structural pnpm monorepo migration before introducing factory or unit semantics.
- 2026-10-07: Existing expression strings are a hard compatibility boundary.
- 2026-10-07: The first publishable packages are `ifc-expressions`, `ifc-expressions-units`, and `ifc-expressions-units-qudtlib`.
- 2026-10-08: Context-object factory identity is nominal: two context-object types belong to the same nominal type only when they share the exact factory instance.
- 2026-10-08: Context-object member catalogs use separate exact lookup and bounded prefix completion operations; completion may report an incomplete result.
- 2026-10-08: Existing eager member maps remain supported through a live, case-insensitive adapter; provider catalogs may define literal case-sensitive lookup.
- 2026-10-08: Portable aliases are pinned to the official IFC4X3_ADD2 (IFC 4.3.2.0) schema: units combine `IfcSIUnitName` with optional `IfcSIPrefix`; measures combine `IfcUnitEnum` and `IfcDerivedUnitEnum`, remove the `UNIT` suffix, and exclude `USERDEFINED`.
- 2026-10-08: The default provider is pinned to `@qudtlib/allunits` 7.1.0 and retains all identity, conversion, convertibility, and quantity-kind hierarchy behavior.
- 2026-10-08: Member access accepts reserved literal tokens after `.`, allowing literal provider constants such as `$unit.QUDT.UNKNOWN` without changing standalone literal semantics.
- 2026-10-08: Every concrete expression-facing unit occurrence wraps a provider unit with `project`, `explicit`, `calculated`, or `catalog` provenance. Equality and conversion ignore provenance; `isProjectUnit()` and `isExplicitUnit()` are the initial standardized expression predicates.

## Blocking decisions

None.
