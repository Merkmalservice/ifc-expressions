# ifc-expressions monorepo

This workspace contains three independently versioned npm packages:

- [`@ifc-expressions/core`](packages/core) for parsing, evaluation, and autocomplete
- [`@ifc-expressions/units`](packages/units) for provider-neutral unit and measure support
- [`@ifc-expressions/units-qudtlib`](packages/units-qudtlib) for the QUDT provider

Consumers upgrading from the unscoped `ifc-expressions` package should
install `@ifc-expressions/core` and update their import specifiers.

Install dependencies with `pnpm install`, then use the root `build`, `test`,
`typecheck`, and `check` scripts to run the corresponding command in every
package that provides it.

Published changes require a Changeset. See [RELEASING.md](RELEASING.md) for
the contribution flow and the one-time GitHub/npm trusted-publishing setup.
