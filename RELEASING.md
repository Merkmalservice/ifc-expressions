# Releasing packages

The three workspace packages are versioned independently with Changesets and
published together when their dependency graph requires it:

1. `ifc-expressions`
2. `ifc-expressions-units`
3. `ifc-expressions-units-qudtlib`

Changesets updates dependent peer ranges when a dependency bump makes the
current range invalid. It builds a publish plan and packs the unpublished
versions in dependency order.

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
Merging that pull request builds and verifies the tarballs. The staging job
runs on Node.js 26.13.1 with npm 11.20.0 and uses OIDC to submit the verified
tarballs to npm with their planned dist-tags.

Review the exact versions under **Staged Packages** on npm and approve them
with 2FA. Approve the core first, followed by the units package and the QUDT
provider when they are part of the same release. After verifying the versions
are public, create the GitHub releases with tags named `<package>@<version>`
and target the commit that produced the tarballs.

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
- allowed actions: staged publishing only

Do this independently for `ifc-expressions`, `ifc-expressions-units`, and
`ifc-expressions-units-qudtlib`. The staging job receives an OIDC token only
after the build-and-pack job has succeeded and the protected environment has
approved the job. Replace an older trusted publisher configuration that only
allows direct publishing. Configure the trusted publisher shortly before its
first use because an unvalidated configuration expires after two days.

npm requires an existing package before its trusted publisher can be
configured. For a new package, download the verified tarball from the build
job. Sign in to npm and run `npm stage publish <tarball> --access public --tag <tag>`
using the dist-tag recorded in `publish-plan.json`. Approve the first version
with 2FA, then configure its trusted publisher for the next release.

If a staging run stops midway, review the staged entries on npm. Approve the
successful submissions before rerunning the workflow so Changesets excludes
those versions. Use a new workflow dispatch to generate a fresh publish plan.

## Emergency unpublish

Use the **Unpublish package version from npm** workflow only when npm's
unpublish policy allows it and removal is genuinely necessary. It accepts a
package from a fixed list, requires an exact semantic version and an explicit
confirmation, verifies that the version exists, and then waits for approval of
the `npm-unpublish` environment. Prefer deprecation for a version that should
remain installable.
