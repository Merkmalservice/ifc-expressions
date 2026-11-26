# Changesets

Every pull request that changes a published package should include a changeset:

```bash
pnpm changeset
```

Select each affected package, choose its semantic-version bump, and describe the consumer-visible change. Use `pnpm changeset --empty` for an intentional change that affects no published package.

The release workflow collects these files into a version pull request for the
`@ifc-expressions` packages. Merging that pull request builds the tarballs and
starts npm staging. See [RELEASING.md](../RELEASING.md) for maintainer approval
and GitHub release steps.
