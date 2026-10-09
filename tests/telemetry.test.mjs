import { afterEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const modulePath = require.resolve(join(root, "dist", "index.js"));

const TELEMETRY_URL = "https://pro.lightswind.com/api/npm-telemetry";
const WEEK_MS = 604800000;

const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
const originalFetch = globalThis.fetch;

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    data,
  };
}

function setupBrowser({ hostname, storage = memoryStorage(), doNotTrack, beacon = true, optOut = false }) {
  const sent = [];
  globalThis.window = { location: { hostname }, localStorage: storage };
  if (optOut) globalThis.window.LIGHTSWIND_NO_TELEMETRY = true;
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    writable: true,
    value: {
      doNotTrack,
      ...(beacon ? { sendBeacon: (url, blob) => (sent.push({ via: "beacon", url, blob }), true) } : {}),
    },
  });
  globalThis.fetch = (url, init) => {
    sent.push({ via: "fetch", url, body: init.body });
    return Promise.resolve();
  };
  return { sent, storage };
}

function loadFresh() {
  delete require.cache[modulePath];
  return require(modulePath);
}

afterEach(() => {
  delete globalThis.window;
  if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
  else delete globalThis.navigator;
  globalThis.fetch = originalFetch;
  delete require.cache[modulePath];
});

describe("trackComponent", () => {
  test("is a no-op without a window (SSR / Node)", () => {
    const { trackComponent } = loadFresh();
    assert.doesNotThrow(() => trackComponent("button"));
  });

  for (const hostname of ["localhost", "127.0.0.1", "my-machine.local", ""]) {
    test(`does not send on local host "${hostname}"`, () => {
      const { trackComponent } = loadFresh();
      const { sent } = setupBrowser({ hostname });
      trackComponent("button");
      assert.equal(sent.length, 0);
    });
  }

  test("respects window.LIGHTSWIND_NO_TELEMETRY", () => {
    const { trackComponent } = loadFresh();
    const { sent } = setupBrowser({ hostname: "example.com", optOut: true });
    trackComponent("button");
    assert.equal(sent.length, 0);
  });

  test('respects navigator.doNotTrack === "1"', () => {
    const { trackComponent } = loadFresh();
    const { sent } = setupBrowser({ hostname: "example.com", doNotTrack: "1" });
    trackComponent("button");
    assert.equal(sent.length, 0);
  });

  test("sends one beacon with component name and hostname, then rate-limits for 7 days", async () => {
    const { trackComponent } = loadFresh();
    const { sent, storage } = setupBrowser({ hostname: "example.com" });
    trackComponent("button");
    trackComponent("button");
    assert.equal(sent.length, 1);
    assert.equal(sent[0].via, "beacon");
    assert.equal(sent[0].url, TELEMETRY_URL);
    assert.deepEqual(JSON.parse(await sent[0].blob.text()), { c: "button", d: "example.com" });
    assert.ok(storage.getItem("lw_tel_button"));
  });

  test("rate limit is per component", () => {
    const { trackComponent } = loadFresh();
    const { sent } = setupBrowser({ hostname: "example.com" });
    trackComponent("button");
    trackComponent("card");
    assert.equal(sent.length, 2);
  });

  test("sends again once the 7-day window has passed", () => {
    const { trackComponent } = loadFresh();
    const storage = memoryStorage({ lw_tel_button: String(Date.now() - WEEK_MS - 1000) });
    const { sent } = setupBrowser({ hostname: "example.com", storage });
    trackComponent("button");
    assert.equal(sent.length, 1);
  });

  test("falls back to fetch when sendBeacon is unavailable", () => {
    const { trackComponent } = loadFresh();
    const { sent } = setupBrowser({ hostname: "example.com", beacon: false });
    trackComponent("button");
    assert.equal(sent.length, 1);
    assert.equal(sent[0].via, "fetch");
    assert.deepEqual(JSON.parse(sent[0].body), { c: "button", d: "example.com" });
  });

  test("swallows storage errors (e.g. storage disabled)", () => {
    const { trackComponent } = loadFresh();
    const throwing = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
    setupBrowser({ hostname: "example.com", storage: throwing });
    assert.doesNotThrow(() => trackComponent("button"));
  });
});

describe("package-init beacon (runs on import)", () => {
  test("does not send on localhost", () => {
    const { sent } = setupBrowser({ hostname: "localhost" });
    loadFresh();
    assert.equal(sent.length, 0);
  });

  test("sends once per 7 days on a live hostname", () => {
    const { sent, storage } = setupBrowser({ hostname: "example.com" });
    loadFresh();
    loadFresh();
    assert.equal(sent.length, 1);
    assert.equal(sent[0].url, TELEMETRY_URL);
    assert.ok(storage.getItem("lw_telemetry_registered"));
  });

  test("respects window.LIGHTSWIND_NO_TELEMETRY", () => {
    const { sent } = setupBrowser({ hostname: "example.com", optOut: true });
    loadFresh();
    assert.equal(sent.length, 0);
  });

  test('respects navigator.doNotTrack === "1"', () => {
    const { sent } = setupBrowser({ hostname: "example.com", doNotTrack: "1" });
    loadFresh();
    assert.equal(sent.length, 0);
  });

  test("sends the package-init payload", async () => {
    const { sent } = setupBrowser({ hostname: "example.com" });
    loadFresh();
    assert.deepEqual(JSON.parse(await sent[0].blob.text()), { c: "package-init", d: "example.com" });
  });

  test("swallows storage errors on import", () => {
    const throwing = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
    setupBrowser({ hostname: "example.com", storage: throwing });
    assert.doesNotThrow(() => loadFresh());
  });
});
