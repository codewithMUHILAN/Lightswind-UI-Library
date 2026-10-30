import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const require = createRequire(import.meta.url);

test("every package.json entry point resolves to a built file", () => {
  const targets = [
    pkg.main,
    pkg.module,
    ...Object.values(pkg.exports),
    ...Object.values(pkg.bin),
  ];
  for (const target of targets) {
    assert.ok(existsSync(join(root, target)), `missing file for entry point: ${target}`);
  }
});

test("CLI MCP launcher target exists", () => {
  assert.ok(existsSync(join(root, "dist", "mcp", "index.js")));
});

test("CJS build exports version and trackComponent", () => {
  const mod = require(join(root, pkg.main));
  assert.equal(typeof mod.version, "string");
  assert.equal(typeof mod.trackComponent, "function");
});

test("exported version matches package.json", async () => {
  assert.equal(require(join(root, pkg.main)).version, pkg.version);
  const esm = await import(pathToFileURL(join(root, pkg.module)).href);
  assert.equal(esm.version, pkg.version);
});

test("ESM build exports the same API as the CJS build", async () => {
  const esm = await import(pathToFileURL(join(root, pkg.module)).href);
  const cjs = require(join(root, pkg.main));
  assert.deepEqual(Object.keys(esm).sort(), Object.keys(cjs).sort());
  assert.equal(esm.version, cjs.version);
});

test("dist/styles.css is an exact copy of src/styles/lightswind.css", () => {
  const built = readFileSync(join(root, "dist", "styles.css"));
  const source = readFileSync(join(root, "src", "styles", "lightswind.css"));
  assert.ok(built.equals(source));
});

test("type declarations are emitted for the main entry", () => {
  assert.ok(existsSync(join(root, "dist", "index.d.ts")));
});

test("every path in package.json files exists", () => {
  for (const entry of pkg.files) {
    assert.ok(existsSync(join(root, entry)), `"files" lists missing path: ${entry}`);
  }
});

test("published tarball contains everything the CLI copies into user projects", () => {
  const [packed] = JSON.parse(
    execSync("npm pack --dry-run --json --ignore-scripts", { cwd: root, encoding: "utf8" })
  );
  const files = new Set(packed.files.map((f) => f.path));
  const required = [
    "bin/lightswind.js",
    "bin/validators.js",
    "bin/component-deps.json",
    "dist/mcp/index.js",
    "dist/styles.css",
    "src/styles/lightswind.css",
    ...readdirSync(join(root, "src/components/lib")).map((f) => `src/components/lib/${f}`),
    ...readdirSync(join(root, "src/components/hooks")).map((f) => `src/components/hooks/${f}`),
  ];
  assert.deepEqual(required.filter((f) => !files.has(f)), []);
  assert.equal([...files].some((f) => f.startsWith("tests/")), false, "tests should not be published");
});

test("runtime dependencies imported by the MCP server are declared", () => {
  const bundle = readFileSync(join(root, "dist", "mcp", "index.js"), "utf8");
  const imported = new Set(
    [...bundle.matchAll(/require\("([^"./][^"]*)"\)/g)]
      .map((m) => m[1])
      .filter((spec) => !/^(fs|path|os|https?|crypto|child_process)$/.test(spec))
      .filter((spec) => !spec.startsWith("lightswind/"))
      .map((spec) => (spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]))
  );
  for (const dep of imported) {
    assert.ok(pkg.dependencies[dep], `"${dep}" is required at runtime but not in dependencies`);
  }
});
