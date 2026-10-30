import { readFileSync } from "fs";
import { copyFile } from "fs/promises";
import { defineConfig } from "tsup";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "mcp/index": "src/mcp/index.ts",
  },
  // Output paths must match package.json "main", "module" and bin/lightswind.js (dist/mcp/index.js).
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
  define: {
    __LIGHTSWIND_VERSION__: JSON.stringify(pkg.version),
  },
  onSuccess: async () => {
    await copyFile("src/styles/lightswind.css", "dist/styles.css");
  },
});
