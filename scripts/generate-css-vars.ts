// scripts/generate-css-vars.ts
//
// theme/tokens.ts is the ONLY place color values are typed by hand. This
// script reads it and writes/updates the CSS variable block into any target
// file via injectThemeBlock (safe to re-run, only touches the marked block).
//
// Today: regenerates registry/mobile/nativewind/theme/global.css
// Future: when web-tailwind exists, add its target file to TARGETS below —
//   e.g. "registry/web/tailwind/theme/global.css" — and it gets the exact
//   same values, generated, never hand-copied.
//
// Usage: npx ts-node scripts/generate-css-vars.ts

import path from "node:path";
import { injectThemeBlock } from "./inject-css-vars";
import { defaultThemeValues } from "../theme/tokens";

const TARGETS = ["registry/mobile/nativewind/theme/global.css"];

function toKebabCase(key: string) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function buildCssBlock(): string {
  const lines = Object.entries(defaultThemeValues).map(
    ([key, value]) => `  --${toKebabCase(key)}: ${value};`,
  );
  return `:root {\n${lines.join("\n")}\n}`;
}

const block = buildCssBlock();
for (const target of TARGETS) {
  injectThemeBlock(path.join(__dirname, "..", target), block);
}
