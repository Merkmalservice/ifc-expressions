# Changesets

Every pull request that changes a published package should include a changeset:

```bash
pnpm changeset
```

Select each affected package, choose its semantic-version bump, and describe the consumer-visible change. Use `pnpm changeset --empty` for an intentional change that affects no published package.

The release workflow collects these files into a version pull request. Merging that pull request publishes every newly versioned package in dependency order and creates package-specific tags and GitHub releases.
