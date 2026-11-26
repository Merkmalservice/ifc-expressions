import { rm, writeFile } from "node:fs/promises";

const packageRoot = new URL("../", import.meta.url);

async function clean(paths) {
  await Promise.all(
    paths.map((path) =>
      rm(new URL(path, packageRoot), { recursive: true, force: true })
    )
  );
}

switch (process.argv[2]) {
  case "clean":
    await clean(["dist", "tmp", "src/gen"]);
    break;
  case "clean-tests":
    await clean(["tmp/jest/compiled"]);
    break;
  case "mark-modules":
    await Promise.all([
      writeFile(
        new URL("dist/mjs/package.json", packageRoot),
        '{"type":"module"}\n'
      ),
      writeFile(
        new URL("dist/cjs/package.json", packageRoot),
        '{"type":"commonjs"}\n'
      ),
    ]);
    break;
  default:
    throw new Error("Expected clean, clean-tests, or mark-modules");
}
