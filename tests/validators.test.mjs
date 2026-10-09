import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { isSafePackageSpec, isSafeComponentName } = require("../bin/validators.js");
const registry = require("../registry.json");
const componentDeps = require("../bin/component-deps.json");
const blocks = require("../blocks.json");

describe("isSafePackageSpec", () => {
  for (const spec of [
    "clsx",
    "framer-motion",
    "@react-three/fiber",
    "@gsap/react",
    "lodash.debounce",
    "JSONStream",
    "three@0.184.0",
    "framer-motion@^12.0.0",
    "react@~18.2",
    "next@latest",
    "@types/node@20.11.25",
    "pkg@1.0.0-beta.1+build.5",
  ]) {
    test(`accepts ${spec}`, () => assert.equal(isSafePackageSpec(spec), true));
  }

  for (const spec of [
    "",
    " ",
    "--registry=https://evil.example",
    "-g",
    "a;rm -rf ~",
    "a && b",
    "a|b",
    "$(id)",
    "`id`",
    "a b",
    "a\nb",
    "a>out",
    "pkg@*",
    "pkg@>=1",
    "../evil",
    "/abs/path",
    "@scope",
    "@scope/",
    "file:../evil",
    "git+https://example.com/x.git",
    "a".repeat(215),
    null,
    undefined,
    42,
    ["clsx"],
  ]) {
    test(`rejects ${JSON.stringify(spec)?.slice(0, 40)}`, () => assert.equal(isSafePackageSpec(spec), false));
  }

  test("accepts every dependency declared in registry.json and component-deps.json", () => {
    const deps = [
      ...registry.items.flatMap((i) => i.dependencies ?? []),
      ...Object.values(componentDeps).flat(),
    ];
    assert.ok(deps.length > 0);
    assert.deepEqual(deps.filter((d) => !isSafePackageSpec(d)), []);
  });
});

describe("isSafeComponentName", () => {
  for (const name of ["button", "3d-cards-carousel", "animated_tooltip", "Hero01"]) {
    test(`accepts ${name}`, () => assert.equal(isSafeComponentName(name), true));
  }

  for (const name of [
    "",
    "../button",
    "..",
    "a/b",
    "a\\b",
    "-rf",
    "_private",
    "a b",
    "a.tsx",
    "a;b",
    "%2e%2e",
    "a".repeat(129),
    null,
    undefined,
    {},
  ]) {
    test(`rejects ${JSON.stringify(name)?.slice(0, 40)}`, () => assert.equal(isSafeComponentName(name), false));
  }

  test("accepts every component and block id shipped in the registries", () => {
    const names = [
      ...registry.items.map((i) => i.name),
      ...Object.keys(componentDeps),
      ...blocks.map((b) => b.id),
    ];
    assert.ok(names.length > 0);
    assert.deepEqual(names.filter((n) => !isSafeComponentName(n)), []);
  });
});
