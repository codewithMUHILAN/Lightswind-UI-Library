import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { startMcp } from "./helpers/mcp-client.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const serverEntry = join(root, "dist", "mcp", "index.js");
const TIMEOUT_MS = 300;

const REGISTRY = {
  items: [
    {
      name: "glow-button",
      title: "Glow Button",
      description: "A glowing animated button",
      meta: { category: "buttons" },
      files: [{ content: "export function GlowButton() { return <button />; }" }],
    },
    {
      name: "pro-card&debug=1",
      title: "Pro Card",
      description: "A premium card",
      type: "lightswind:pro",
      meta: { category: "cards" },
      files: [{ content: "" }],
    },
  ],
};

let server;
let baseUrl;
let mode;
let requests;

before(async () => {
  server = createServer((req, res) => {
    requests.push(req.url);
    if (mode === "hang") return; // never respond
    if (req.url.startsWith("/api/registry")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(REGISTRY));
    }
    if (req.url.startsWith("/api/v1/components")) {
      res.writeHead(401, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: false, error: "Invalid API key" }));
    }
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<html>error</html>");
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.closeAllConnections();
  server.close();
});

beforeEach(() => {
  requests = [];
});

function textOf(res) {
  return res.result.content.map((c) => c.text).join("\n");
}

async function withServer(fn) {
  const mcp = startMcp([serverEntry], {
    LIGHTSWIND_REGISTRY_URL: baseUrl,
    LIGHTSWIND_API_URL: baseUrl,
    LIGHTSWIND_REQUEST_TIMEOUT_MS: String(TIMEOUT_MS),
    LIGHTSWIND_API_KEY: "sk_pro_test",
  });
  try {
    await mcp.initialize();
    await fn(mcp);
  } finally {
    await mcp.close();
  }
}

describe("MCP server network resilience", () => {
  test("a hanging registry times out instead of hanging the tool call", async () => {
    mode = "hang";
    await withServer(async (mcp) => {
      const started = Date.now();
      const res = await mcp.request("tools/call", { name: "list_all_components", arguments: {} }, 5000);
      const elapsed = Date.now() - started;
      assert.match(textOf(res), /\(0 found\)/);
      assert.ok(elapsed < TIMEOUT_MS * 6, `took ${elapsed}ms`);
      assert.match(mcp.getStderr(), /timed out/);
    });
  });

  test("a failed registry fetch is retried on the next call instead of cached", async () => {
    mode = "hang";
    await withServer(async (mcp) => {
      const first = await mcp.request("tools/call", { name: "list_all_components", arguments: {} }, 5000);
      assert.match(textOf(first), /\(0 found\)/);

      mode = "ok";
      const second = await mcp.request("tools/call", { name: "list_all_components", arguments: {} }, 5000);
      assert.match(textOf(second), /\(2 found\)/);
      assert.match(textOf(second), /Glow Button/);
    });
  });

  test("concurrent calls share a single registry request", async () => {
    mode = "ok";
    await withServer(async (mcp) => {
      await Promise.all([
        mcp.request("tools/call", { name: "list_categories", arguments: {} }),
        mcp.request("tools/call", { name: "search_components", arguments: { query: "glow" } }),
        mcp.request("tools/call", { name: "list_all_components", arguments: {} }),
      ]);
      assert.equal(requests.filter((u) => u.startsWith("/api/registry")).length, 1, JSON.stringify(requests));
    });
  });

  test("loaded registry data drives search, categories and get_component", async () => {
    mode = "ok";
    await withServer(async (mcp) => {
      const search = await mcp.request("tools/call", { name: "search_components", arguments: { query: "glowing" } });
      assert.match(textOf(search), /Glow Button/);

      const cats = await mcp.request("tools/call", { name: "list_categories", arguments: {} });
      assert.match(textOf(cats), /\*\*buttons\*\*/);
      assert.match(textOf(cats), /\*\*cards\*\*/);

      const comp = await mcp.request("tools/call", { name: "get_component", arguments: { name: "glow-button" } });
      assert.match(textOf(comp), /export function GlowButton/);
    });
  });

  test("pro component lookups URL-encode the name and surface the server error", async () => {
    mode = "ok";
    await withServer(async (mcp) => {
      const res = await mcp.request("tools/call", { name: "get_component", arguments: { name: "Pro Card" } });
      assert.match(textOf(res), /Access Restricted\*\*: Invalid API key/);
      const proRequest = requests.find((u) => u.startsWith("/api/v1/components"));
      assert.equal(proRequest, "/api/v1/components?name=pro-card%26debug%3D1");
    });
  });

  test("block tools fall back to bundled data when the blocks API returns non-JSON", async () => {
    mode = "ok";
    await withServer(async (mcp) => {
      const res = await mcp.request("tools/call", { name: "list_blocks", arguments: {} });
      const total = Number(textOf(res).match(/\((\d+) total\)/)?.[1]);
      assert.ok(total > 0, textOf(res));
    });
  });

  test("get_block encodes the block id in the request", async () => {
    mode = "ok";
    await withServer(async (mcp) => {
      const list = await mcp.request("tools/call", { name: "list_blocks", arguments: {} });
      assert.ok(list.result);
      requests = [];
      await mcp.request("tools/call", { name: "get_block", arguments: { name: "hero" } });
      for (const url of requests.filter((u) => u.startsWith("/api/v1/secure-block"))) {
        assert.match(url, /^\/api\/v1\/secure-block\?id=[A-Za-z0-9%._~-]+$/);
      }
    });
  });
});
