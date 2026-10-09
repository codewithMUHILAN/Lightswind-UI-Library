import { after, before, beforeEach, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "bin", "lightswind.js");

let server;
let registryUrl;
let base;
let project;
let marker;
const registry = new Map();

before(async () => {
  base = mkdtempSync(join(tmpdir(), "lightswind-cli-"));
  project = join(base, "project");
  mkdirSync(join(project, "src", "components"), { recursive: true });
  marker = join(base, "INJECTED");
  // Core deps are pre-declared so the CLI never tries to install real packages.
  writeFileSync(
    join(project, "package.json"),
    JSON.stringify({
      name: "fixture",
      dependencies: {
        clsx: "*",
        "tailwind-merge": "*",
        "class-variance-authority": "*",
        "lucide-react": "*",
        lightswind: "*",
      },
    })
  );

  server = createServer((req, res) => {
    const name = decodeURIComponent(req.url.replace(/^\/r\//, "").replace(/\.json$/, ""));
    const item = registry.get(name) ?? registry.get("*");
    res.writeHead(item ? 200 : 404, { "Content-Type": "application/json" });
    res.end(JSON.stringify(item ?? { error: "not found" }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  registryUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  registry.clear();
  for (const leftover of [marker, join(base, "escaped.tsx"), join(base, "escaped-cli.tsx")]) {
    rmSync(leftover, { force: true });
  }
});

after(() => {
  server.close();
  rmSync(base, { recursive: true, force: true });
});

function runAdd(name) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [cli, "add", name, "--yes"], {
      cwd: project,
      env: { ...process.env, LIGHTSWIND_REGISTRY_URL: registryUrl, npm_config_user_agent: "npm/10" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", (c) => (out += c));
    child.stderr.on("data", (c) => (out += c));
    const timer = setTimeout(() => child.kill("SIGKILL"), 20000);
    child.on("exit", (code) => {
      clearTimeout(timer);
      resolve({ code, out });
    });
  });
}

test("registry-supplied dependency names cannot inject shell commands", async () => {
  registry.clear();
  registry.set("evil-deps", {
    files: [{ content: "export const X = 1;\n" }],
    dependencies: [`--version; touch "${marker}"`, `$(touch "${marker}")`, "left-pad`touch x`"],
  });

  const { out } = await runAdd("evil-deps");
  assert.equal(existsSync(marker), false, `shell injection executed. CLI output:\n${out}`);
  assert.ok(existsSync(join(project, "src", "components", "lightswind", "evil-deps.tsx")), out);
});

test("dependency names parsed from component code cannot inject shell commands", async () => {
  registry.clear();
  // The CLI keeps only the text before the first "/" of an import path, so the payload avoids slashes.
  registry.set("evil-imports", {
    files: [{ content: `import x from "--version;cd ..;touch INJECTED";\nexport const X = x;\n` }],
  });

  const { out } = await runAdd("evil-imports");
  assert.equal(existsSync(marker), false, `shell injection executed. CLI output:\n${out}`);
});

test("registry-supplied internal dependency names cannot write outside the project", async () => {
  registry.clear();
  registry.set("evil-paths", {
    files: [{ content: "export const X = 1;\n" }],
    internalDependencies: ["../../../../escaped"],
  });
  registry.set("*", { files: [{ content: "export const PWNED = true;\n" }] });

  const { out } = await runAdd("evil-paths");
  assert.equal(existsSync(join(base, "escaped.tsx")), false, `file written outside project. CLI output:\n${out}`);
  assert.ok(existsSync(join(project, "src", "components", "lightswind", "evil-paths.tsx")), out);
});

test("invalid component names from the command line are rejected", async () => {
  registry.clear();
  registry.set("*", { files: [{ content: "export const PWNED = true;\n" }] });

  const { code, out } = await runAdd("../../../../escaped-cli");
  assert.notEqual(code, 0, out);
  assert.equal(existsSync(join(base, "escaped-cli.tsx")), false, out);
});
