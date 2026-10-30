import { spawn } from "node:child_process";

// Port 9 (discard) refuses connections locally, so tests never reach the real lightswind.com APIs.
export const OFFLINE_ENV = {
  LIGHTSWIND_REGISTRY_URL: "http://127.0.0.1:9",
  LIGHTSWIND_API_URL: "http://127.0.0.1:9",
};

export function startMcp(args, env = OFFLINE_ENV) {
  const child = spawn(process.execPath, args, {
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, ...env },
  });
  const pending = new Map();
  let nextId = 1;
  let buffer = "";
  let stderr = "";

  child.stderr.on("data", (chunk) => (stderr += chunk));
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      const msg = JSON.parse(line);
      const waiter = pending.get(msg.id);
      if (waiter) {
        pending.delete(msg.id);
        waiter(msg);
      }
    }
  });

  const exited = new Promise((resolve) => child.on("exit", (code, signal) => resolve({ code, signal })));

  function request(method, params = {}, timeoutMs = 10000) {
    const id = nextId++;
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`Timed out waiting for ${method}. stderr: ${stderr}`));
      }, timeoutMs);
      pending.set(id, (msg) => {
        clearTimeout(timer);
        resolve(msg);
      });
    });
  }

  function notify(method, params = {}) {
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
  }

  async function initialize() {
    const res = await request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "lightswind-tests", version: "0.0.0" },
    });
    notify("notifications/initialized");
    return res;
  }

  async function close() {
    child.stdin.end();
    const result = await Promise.race([
      exited,
      new Promise((resolve) => setTimeout(() => resolve(null), 3000)),
    ]);
    if (result === null) {
      child.kill("SIGKILL");
      await exited;
      return { code: null, signal: "SIGKILL", forced: true };
    }
    return { ...result, forced: false };
  }

  return { child, request, notify, initialize, close, getStderr: () => stderr };
}
