import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const [packDirectory, option] = process.argv.slice(2);
const dryRun = option === "--dry-run";
const npmCli = process.env.npm_execpath;
if (!packDirectory || (option && !dryRun) || !npmCli) {
  throw new Error("Usage: npm run stage-release -- <pack-directory> [--dry-run]");
}

const { version, plan } = JSON.parse(
  readFileSync(resolve(packDirectory, "publish-plan.json"), "utf8")
);
if (version !== 1 || !Array.isArray(plan)) {
  throw new Error("Unsupported Changesets publish plan");
}

// Verify the complete batch before making any registry requests.
const releases = plan.flat().map(({ kind, name, version, tag, access, tarball }) => {
  const spec = `${name}@${version}`;
  if (
    kind !== "publish" ||
    access !== "public" ||
    !tag ||
    !/^packages\/[\w.-]+\.tgz$/.test(tarball?.path)
  ) {
    throw new Error(`Invalid publish plan entry for ${spec}`);
  }
  const path = resolve(packDirectory, tarball.path);
  const integrity = createHash("sha256").update(readFileSync(path)).digest("base64");
  if (tarball.integrity !== `sha256-${integrity}`) {
    throw new Error(`Tarball integrity mismatch for ${spec}`);
  }
  return { spec, path, tag, access };
});

for (const { spec, path, tag, access } of releases) {
  console.log(`Staging ${spec} with dist-tag ${tag}`);
  const args = [npmCli, "stage", "publish", path, "--tag", tag, "--access", access];
  if (dryRun) args.push("--dry-run");
  const result = spawnSync(process.execPath, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`npm stage publish failed for ${spec}`);
  }
  if (!dryRun && process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- Staged ${spec} (${tag}) for npm approval.\n`);
  }
}
