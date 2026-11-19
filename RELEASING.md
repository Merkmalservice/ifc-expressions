# Releasing packages

The three workspace packages are versioned independently with Changesets and
published together when their dependency graph requires it:

1. `ifc-expressions`
2. `ifc-expressions-units`
3. `ifc-expressions-units-qudtlib`

Changesets updates dependent peer ranges when a dependency bump makes the
current range invalid. Its publish command discovers unpublished versions and
publishes them in dependency order.

## Pull requests

Run this before opening a pull request that changes a published package:

```bash
pnpm changeset
```

Select every package with a consumer-visible change, choose the appropriate
semantic-version bump, and write a short release note. For maintenance that
does not change any published package, record that decision explicitly:

```bash
pnpm changeset --empty
```

On `main`, the release workflow creates or updates a version pull request.
Merging that pull request starts a verified, dependency-ordered publish and
creates package-specific Git tags and GitHub releases.

For a prerelease series, enter Changesets prerelease mode on a branch with
`pnpm changeset pre enter beta`. Commit `.changeset/pre.json` and the generated
version changes. Use `pnpm changeset pre exit` when the series is ready to
return to stable releases.

## One-time GitHub setup

1. In the repository Actions settings, allow GitHub Actions to create and
   approve pull requests. The release workflow uses the repository-provided
   `GITHUB_TOKEN`; it does not require a personal access token.
2. Create a protected `npm-release` environment. Add required reviewers and
   prevent self-review if the repository's plan supports those controls.
3. Create a more restrictive `npm-unpublish` environment with required
   reviewers. Add a granular npm access token named
   `NPMJS_UNPUBLISH_TOKEN` to this environment only. Limit it to these three
   packages and revoke it whenever it is no longer needed. npm trusted
   publishing does not authorize unpublishing.
4. Remove the obsolete `MMS_GITHUB_TOKEN` and `NPMJS_ACCESS_TOKEN` repository
   secrets after the new flow has been verified.

## One-time npm trusted-publisher setup

Configure a trusted publisher for each package on npm:

- repository owner: `Merkmalservice`
- repository: `ifc-expressions`
- workflow filename: `release-and-deploy.yml`
- environment: `npm-release`

Do this independently for `ifc-expressions`, `ifc-expressions-units`, and
`ifc-expressions-units-qudtlib`. The publish job receives an OIDC token only
after the build-and-pack job has succeeded and the protected environment has
approved the release.

npm requires an existing package before its trusted publisher can be
configured. For the first release of a unit package, an npm maintainer can
stage the verified tarball from the Changesets version commit with
`npm stage publish <tarball>` and approve it with two-factor authentication.
This requires npm 11.15.0 or later. An authenticated maintainer can also
publish that tarball directly with `npm publish <tarball> --access public`.
Publish the core before the units package, then publish the QUDT provider so
their peer dependencies are available. Configure trusted publishing for each
new package after its first release.

## Emergency unpublish

Use the **Unpublish package version from npm** workflow only when npm's
unpublish policy allows it and removal is genuinely necessary. It accepts a
package from a fixed list, requires an exact semantic version and an explicit
confirmation, verifies that the version exists, and then waits for approval of
the `npm-unpublish` environment. Prefer deprecation for a version that should
remain installable.
