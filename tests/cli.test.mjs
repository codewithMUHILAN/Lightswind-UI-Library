import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OFFLINE_ENV, startMcp } from "./helpers/mcp-client.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "bin", "lightswind.js");

function run(...args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    timeout: 10000,
    env: { ...process.env, ...OFFLINE_ENV },
  });
}

test("help lists the documented commands and exits 0", () => {
  for (const flag of ["--help", "-h", "help"]) {
    const res = run(flag);
    assert.equal(res.status, 0, flag);
    for (const cmd of ["init", "add <component-name>", "add-block", "list", "theme", "mcp"]) {
      assert.ok(res.stdout.includes(cmd), `${flag} output missing "${cmd}"`);
    }
  }
});

test("unknown command prints an error and exits non-zero", () => {
  const res = run("definitely-not-a-command");
  assert.equal(res.status, 1);
  assert.match(res.stderr, /Unknown command: definitely-not-a-command/);
});

test("`lightswind mcp` starts a working MCP server over stdio", async () => {
  const mcp = startMcp([cli, "mcp"]);
  try {
    const init = await mcp.initialize();
    assert.equal(init.result.serverInfo.name, "lightswind-ui-mcp");
    const tools = await mcp.request("tools/list");
    assert.ok(tools.result.tools.length > 0);
  } finally {
    const exit = await mcp.close();
    assert.equal(exit.forced, false, "MCP server did not exit after stdin closed");
  }
});
