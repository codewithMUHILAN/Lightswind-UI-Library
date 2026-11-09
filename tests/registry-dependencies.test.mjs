import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Every third-party package imported by an item's embedded source must be
// declared in that item's `dependencies` array in registry.json. The CLI
// installs from bin/component-deps.json, but registry consumers (and the
// shadcn-compatible index) rely on the per-item declarations in
// registry.json; an undeclared import means a broken component after
// install.
//
// `react` and `react-dom` are provided by every consumer app. `next` is the
// target framework of the registry (imports are next/image, next/link,
// next/dynamic) and is treated as ambient, matching bin/component-deps.json
// which never lists it. Relative paths, absolute paths and `@/` aliases
// resolve inside the consumer project and are not packages.
const IMPLIED = new Set(["react", "react-dom", "next"]);

const IMPORT_RE = /import\s+(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g;

function packageName(specifier) {
  if (specifier.startsWith("@")) {
    return specifier.split("/").slice(0, 2).join("/");
  }
  return specifier.split("/")[0];
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(path.join(root, "registry.json"), "utf8"));

test("every registry item declares its third-party imports", () => {
  const offenders = [];
  for (const item of registry.items) {
    const declared = new Set((item.dependencies ?? []).map((d) => packageName(d)));
    const imported = new Set();
    for (const file of item.files ?? []) {
      for (const match of (file.content ?? "").matchAll(IMPORT_RE)) {
        const specifier = match[1];
        if (
          specifier.startsWith("./") ||
          specifier.startsWith("../") ||
          specifier.startsWith("/") ||
          specifier.startsWith("@/")
        ) {
          continue;
        }
        imported.add(packageName(specifier));
      }
    }
    const missing = [...imported].filter((p) => !IMPLIED.has(p) && !declared.has(p));
    if (missing.length > 0) {
      offenders.push(`${item.name}: imports ${missing.join(", ")} but dependencies is [${(item.dependencies ?? []).join(", ")}]`);
    }
  }
  assert.deepEqual(offenders, [], `registry items with undeclared imports:\n${offenders.join("\n")}`);
});

