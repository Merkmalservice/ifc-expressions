# Architecture progress tracker

Updated: 2026-10-07  
Branch: `architecture/unit-modules`

## Current milestone: architecture baseline

- [x] Create an isolated feature branch and worktree.
- [x] Inspect the current package, context-object type, equality, builtin, and completion structure.
- [x] Inspect the `ecotwin-js` pnpm workspace conventions.
- [x] Draft the monorepo and units-extension specification.
- [x] Record backwards compatibility as a hard constraint.
- [ ] Resolve the open architecture decisions with the maintainer.
- [ ] Approve this design before moving source files.

## Phase 1: compatibility baseline

- [ ] Inventory public root exports and any supported deep imports.
- [ ] Capture current npm package contents and ESM/CommonJS resolution behavior.
- [ ] Identify representative expression strings from live projects.
- [ ] Add compatibility tests for parsing, typing, rendering, and evaluation.
- [ ] Record current legacy `ContextObjectValue` equality behavior.
- [ ] Establish the minimum supported Node.js versions for the migrated packages.

Exit criterion: the existing package can be rebuilt and its expression compatibility suite is green before and after relocation.

## Phase 2: pnpm monorepo migration

- [ ] Add private root `package.json` with recursive build, test, typecheck, and formatting scripts.
- [ ] Add `pnpm-workspace.yaml`, lockfile, and shared TypeScript configuration.
- [ ] Move the current package into `packages/ifc-expressions` without semantic changes.
- [ ] Preserve `ifc-expressions` package name, exports, and publishable files.
- [ ] Add empty package skeletons for `ifc-expressions-units` and `ifc-expressions-units-qudtlib`.
- [ ] Add independent package build and test scripts.
- [ ] Update CI to build/test all packages and publish selected packages safely.
- [ ] Verify `pnpm pack` output for every package.

Exit criterion: all three packages build independently and the relocated base package passes the compatibility suite unchanged.

## Phase 3: generic context-object factories

- [ ] Specify the minimal `ContextObjectTypeFactory` contract.
- [ ] Add nominal factory identity to static context-object types.
- [ ] Associate factory identity with created `ContextObjectValue` instances.
- [ ] Extend function arguments and return types to retain factory identity.
- [ ] Drive member completion and signature help from the same static metadata.
- [ ] Preserve the existing builtin registry API through compatibility adapters.
- [ ] Add configuration validation for duplicate or incompatible factory registrations.

Exit criterion: two distinct context-object factories are statically distinguishable without adding primitive expression types.

## Phase 4: context-object operators

- [ ] Define static operator signatures for factory-backed context objects.
- [ ] Implement equality dispatch through the common factory.
- [ ] Derive `!=` from equality.
- [ ] Reject unsupported and cross-factory operators during expression compilation.
- [ ] Preserve legacy context-object reference equality.
- [ ] Add operator-aware completion and diagnostics where applicable.

Exit criterion: supported comparisons compile and evaluate; unsupported comparisons never reach runtime.

## Phase 5: units extension

- [ ] Define unit and quantity-kind factory contracts as context-object specializations.
- [ ] Register the optional `$unit` builtin and typed operations.
- [ ] Decide and document the user-facing quantity-kind terminology.
- [ ] Specify unit provenance predicates.
- [ ] Select the portable alias set and its compatibility policy.
- [ ] Test that the base package works without any unit extension installed.

Exit criterion: a mock provider can supply units, quantity kinds, equality, conversion, hierarchy, provenance, and aliases with full static checking and completion.

## Phase 6: QUDT provider

- [ ] Select compatible `qudtlib` packages and versions.
- [ ] Implement provider-owned unit identity, equality, conversion, and compatibility.
- [ ] Implement provider-owned quantity-kind identity and hierarchy.
- [ ] Support valid provider objects for uncatalogued/anonymous derived units.
- [ ] Generate or lazily expose the full QUDT catalog with completion.
- [ ] Bind every portable alias to a QUDT provider object.
- [ ] Decide how the recommended/default provider is composed without cyclic dependencies.

Exit criterion: QUDT-backed expressions work for portable aliases, the full catalog, and anonymous IFC-derived units without conversion logic in the base or units-contract packages.

## Phase 7: consuming-project integration

- [ ] Extend result/query context registrations with typed unit and quantity-kind references.
- [ ] Preserve explicit versus inherited project-unit provenance.
- [ ] Add the motivating thickness-reinterpretation filter as an integration test.
- [ ] Verify that correct model units continue to be treated as the source of truth.
- [ ] Add diagnostics for provider-resolution failures.

Exit criterion: the original `ET_IH-Dicke` case can be detected and explicitly repaired by a filter without changing generic IFC unit interpretation.

## Decision log

- 2026-10-07: Units and quantity kinds remain factory-backed `ContextObjectRef` values, not primitive expression types.
- 2026-10-07: Unit conversion, identity, compatibility, hierarchy, and anonymous-unit construction belong exclusively to the unit provider.
- 2026-10-07: Unit support is optional for `ifc-expressions`; the generic context-object factory/operator mechanism belongs in the base package.
- 2026-10-07: Existing expression strings are a hard compatibility boundary.
- 2026-10-07: The first publishable packages are `ifc-expressions`, `ifc-expressions-units`, and `ifc-expressions-units-qudtlib`.

## Blocking decisions

- [ ] Meaning of “default provider”: explicit recommended composition versus automatic installation/configuration.
- [ ] User-facing name for quantity kinds/measurements.
- [ ] Portable alias scope and naming.
- [ ] QUDT catalog namespace.
- [ ] Shared versus independent package versioning.
- [ ] Required CommonJS and deep-import compatibility surface.
