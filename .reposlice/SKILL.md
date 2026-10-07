---
name: reposlice
description: Use reposlice to narrow repository scope, ingest focused code via slices, and maintain persistent high-quality summaries in .reposlice/ during code exploration or modification tasks. Activate when working with file paths, subsystems, large repos, or when .reposlice/config.yml exists or should be initialized.
---
# reposlice Skill

Use `reposlice` to narrow repository scope for the current task, and to ingest files. Keep slices maintained (with good summaries you write from fresh context) to create compounding value for the repo. 

## First Contact

- If `.reposlice/config.yml` is missing, or if you are starting non-trivial exploration in a repo that may not be prepared, run `reposlice default-setup`.
- If you are unsure whether reposlice is initialized or usable, run `reposlice doctor`.
- Run `reposlice --help` once near the beginning of a first session or after an upgrade to refresh your understanding of the available commands.
- Run `reposlice <command> --help` before using an unfamiliar command or when command behavior has changed.
- If the default setup still leaves the active area too broad, keep repeating targeted `suggest -> adopt -> scan` under that area until the active feature itself is represented by a slice or by a compact backbone of nearby slices.
- Use `reposlice` or `reposlice read <slice>` for the fast cached path.
- Slice arguments accept either the full repo-relative slice path or a unique case-insensitive substring.
- Use `reposlice list` when you want a quick overview of indexed slices and their summary state without drilling into one slice yet.
- If the user starts from a file path, filename, or subsystem name, use `reposlice locate <query>` first.
- Use `reposlice read <slice> --include-parent`, `--include-siblings`, `--include-children`, or `--include-all` when you need to widen or narrow local slice context deliberately.
- If `read` or `locate` reports a missing index, run `reposlice scan`.
- Use `reposlice ingest <slice>` over direct reads. It allows for inclusion/exclusion of files and a changed-since functionality based on a merkle tree.

## Freshness

- reposlice freshness is based on `HEAD` only.
- Local uncommitted edits are not reflected automatically.
- If repository structure or configured slices may have changed since the last scan, run `reposlice scan` again.
- If you or another agent changed the repository and those changes matter for slice boundaries or summaries, refresh reposlice with `reposlice scan` after those changes are represented at `HEAD`.

## Agent Posture

- Treat `.reposlice/` as persistent repository memory, not disposable task scaffolding.
- `.reposlice/` is intended to be tracked in Git, so keep it clean and useful for the next task and the next branch.
- Keep code-ingestion scope tight, but leave the touched area of `.reposlice/` in a better state than you found it.
- Prefer opportunistic upkeep: summarize and refine what is already in context instead of exploring unrelated areas.
- Do not ingest extra code only to refresh summaries unless the user explicitly asks for broader reposlice maintenance.
- Do not stop after adopting only broad package slices when the active feature still spans a much smaller subtree.
- When in doubt, prefer adopting more suggested slices under the active feature path rather than exploring raw files outside slice boundaries.

## Summary Workflow

- Prefer an authored `headline` and `summary_md` over broad code ingestion when they already exist.
- Use `reposlice summary` or `reposlice summary status` to see which slices are already summarized and which targets are ready for summary authoring.
- Work from leaves upward: summarize slices with no direct sub-slices first, then summarize their parents once those direct sub-slices are `up_to_date`.
- The explicit summary loop is: `reposlice summary next-target --within <touched-slice>` -> inspect or ingest fresh context for the returned target -> `reposlice set-summary ...` -> repeat until scoped `next-target` returns `status: complete`.
- Use scoped summary planning for task cleanup: from inside the relevant area, prefer `reposlice summary next-target --within .`; otherwise run `reposlice summary next-target --within <slice>` for each slice you ingested or substantially inspected.
- Use unscoped `reposlice summary next-target` only when the user explicitly asks for repository-wide manual summary maintenance.
- If a touched slice is already sufficiently in context and its summary is `missing` or `stale`, update it in the same task.
- Treat "substantially inspected" the same as "ingested" for summary upkeep. If you meaningfully inspect more than a couple of files inside a slice, add or refresh that slice summary before finishing unless the user explicitly tells you not to modify `.reposlice/`.
- At task close, check summary upkeep for the slices you ingested or substantially inspected, plus direct parents that are now cheap to summarize from current context.
- If you encounter a low-quality headline or summary and you already have the context needed to improve it, replace it with a specific, useful one.
- If direct child summaries are already good and the direct parent is now cheap to summarize from current context, update that parent too.
- Only write summaries from fresh in-context information: inspected files, ingested slice content, or already-read high-quality child summaries.
- Never write or update summaries from path names, directory names, package names, file lists alone, generated templates, or other heuristics.
- Never use scripts, loops, or automation to mass-generate summaries. Missing is better than generic or speculative.
- If you cannot name concrete responsibilities, important files or concepts, and relationships to nearby slices, leave the summary missing and say why.
- Parent summaries must synthesize their child areas; never describe a parent slice as a leaf.
- Use `reposlice set-summary --repo-root --headline <text> --summary-file <path>` for the repository root.
- Use `reposlice set-summary <slice> --headline <text> --summary-file <path>` for a slice.

## Slice Growth

- If a slice still feels too broad, run `reposlice suggest <slice>` to look for deeper sub-slices within that slice.
- `reposlice suggest` keeps drilling down through meaningful fan-out points by default, capped at depth 100; use `reposlice suggest --recurse <n>` to reduce or otherwise control the depth.
- Review the numbered suggestions and adopt them with `reposlice adopt <number> ...`, `reposlice adopt --all`, or the interactive piped flow.
- After adopting narrower `slice_patterns`, run `reposlice scan` again.
- Do not stop at the first broad package slice when the active feature can be represented more precisely by deeper suggested slices.
- Keep a compact structural backbone for the touched area, not just an isolated leaf and not unrelated broad slices elsewhere in the repo.

## Ingest

- Use `reposlice ingest --preview` from inside the relevant area when you want to see the exact files that would be packed before ingesting. Without a target, `ingest` selects the deepest configured slice containing the current working directory.
- Add `--top-files-len <n>` and `--token-count-tree` to preview when you need a slower token and size estimate before ingesting.
- Only ingest after reposlice has already narrowed the scope enough.
- Use `reposlice ingest` to pack the current configured slice with repomix after previewing it.
- Use `reposlice ingest . --preview` and then `reposlice ingest .` when the exact current directory subtree is smaller and more appropriate than the containing slice.
- Use `reposlice ingest <slice>` when you are not currently inside the intended slice.
- Each ingest preview or packed ingest reports a `manifest_hash`; remember hashes that actually entered your context.
- When re-ingesting a slice whose previous `manifest_hash` you know, prefer `reposlice ingest --changed-since <hash>` from inside that slice, or `reposlice ingest <slice> --changed-since <hash>` from elsewhere, so reposlice returns only added or modified files plus deleted-file metadata.
- For focused reads, prefer `reposlice ingest --include <path-or-pattern>` over direct file reads when a refresh may be useful later; the returned `manifest_hash` still covers the whole target slice.
- Use repeatable `--exclude <path-or-pattern>` to subtract tests, generated files, or other irrelevant files from the emitted context.
- Include and exclude patterns may be repo-relative, target-relative, or current-working-directory-relative. From inside a folder, a pattern like `*Chain*.ts` matches files in that folder; use `**/*Chain*.ts` when you intentionally mean any descendant path.
- Do not use a hash merely because it appears in local cache or command output that you did not inspect; the baseline must be content you actually saw.
- Use `reposlice ingest --repo-root` only when the whole repository is truly the right scope.
- `reposlice ingest` uses the stable `.reposlice/repomix.config.json` installed by `reposlice init`.
- You may tweak `.reposlice/repomix.config.json` if this repository needs a different repomix packing style.
- Reuse `latest_ingest_manifest_hash` from `reposlice read`, `reposlice locate`, or `reposlice summary next-target` when re-ingesting the same target; run `reposlice ingest <target> --changed-since <hash>` to get only changed files.
- After ingesting a slice, treat that slice as eligible for immediate summary upkeep if its summary is `missing` or `stale` and the needed context is already loaded.
- Do not use ingest as the only trigger for summary upkeep; substantial direct inspection inside a slice also requires summary maintenance.

## General Rule

- Treat reposlice as slice-level guidance plus lightweight persistent memory.
- Drill down by reading the next relevant slice instead of ingesting many files at once.
- Ingest code only after narrowing to the smallest useful slice.
- Stop once the touched area is materially better for the next task; do not try to map the whole repository unless asked.

- At the end of substantial work, run `reposlice session summary` to report what was ingested, whether `--changed-since` was reused, which summaries were updated, and whether any reposlice commands are unfinished or may have been interrupted. Use `reposlice session list --last <n> --oneline` for a quick human-readable event trail, or omit `--oneline` when structured YAML is needed.
