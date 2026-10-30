import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startMcp } from "./helpers/mcp-client.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const EXPECTED_TOOLS = [
  "get_block",
  "get_component",
  "get_installation_guide",
  "get_usage_example",
  "list_all_components",
  "list_blocks",
  "list_categories",
  "search_components",
];

function textOf(res) {
  return res.result.content.map((c) => c.text).join("\n");
}

describe("MCP server (dist/mcp/index.js)", () => {
  let mcp;

  before(async () => {
    mcp = startMcp([join(root, "dist", "mcp", "index.js")]);
  });

  after(async () => {
    await mcp.close();
  });

  test("initialize returns server info and tools capability", async () => {
    const res = await mcp.initialize();
    assert.equal(res.error, undefined);
    assert.equal(res.result.serverInfo.name, "lightswind-ui-mcp");
    assert.ok(res.result.capabilities.tools);
  });

  test("tools/list returns all tools with object input schemas", async () => {
    const res = await mcp.request("tools/list");
    const names = res.result.tools.map((t) => t.name).sort();
    assert.deepEqual(names, EXPECTED_TOOLS);
    for (const tool of res.result.tools) {
      assert.equal(tool.inputSchema.type, "object", tool.name);
      assert.ok(tool.description.length > 0, tool.name);
    }
  });

  test("get_installation_guide returns the guide for each framework", async () => {
    for (const [framework, heading] of [
      ["nextjs", "Next.js Installation"],
      ["react", "React (Vite/CRA) Installation"],
      ["vite", "Vite Installation"],
    ]) {
      const res = await mcp.request("tools/call", { name: "get_installation_guide", arguments: { framework } });
      assert.match(textOf(res), new RegExp(heading.replace(/[()/.]/g, "\\$&")));
    }
  });

  test("get_installation_guide defaults to Next.js when framework is missing or unknown", async () => {
    for (const args of [{}, { framework: "svelte" }]) {
      const res = await mcp.request("tools/call", { name: "get_installation_guide", arguments: args });
      assert.match(textOf(res), /Next\.js Installation/);
    }
  });

  test("get_usage_example matches sections case-insensitively and falls back for unknown sections", async () => {
    const hero = await mcp.request("tools/call", { name: "get_usage_example", arguments: { section: "Landing HERO" } });
    assert.match(textOf(hero), /Hero Section/);

    const sidebar = await mcp.request("tools/call", { name: "get_usage_example", arguments: { section: "dashboard" } });
    assert.match(textOf(sidebar), /Dashboard Layout/);

    const other = await mcp.request("tools/call", { name: "get_usage_example", arguments: { section: "pricing 🚀 <table>" } });
    assert.match(textOf(other), /pricing 🚀 <table> — Lightswind UI Example/);
  });

  test("get_usage_example with missing section returns isError instead of crashing", async () => {
    const res = await mcp.request("tools/call", { name: "get_usage_example", arguments: {} });
    assert.equal(res.result.isError, true);
    assert.match(textOf(res), /^Error:/);
  });

  test("unknown tool name returns a readable message", async () => {
    const res = await mcp.request("tools/call", { name: "does_not_exist", arguments: {} });
    assert.match(textOf(res), /Unknown tool: does_not_exist/);
  });

  test("malformed tools/call params are rejected with a JSON-RPC error", async () => {
    const res = await mcp.request("tools/call", { arguments: {} });
    assert.ok(res.error, "expected a JSON-RPC error");
  });

  test("server is still responsive after error cases", async () => {
    const res = await mcp.request("tools/list");
    assert.equal(res.result.tools.length, EXPECTED_TOOLS.length);
  });
});
