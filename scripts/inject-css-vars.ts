// scripts/inject-css-vars.ts
//
// This is the core logic a future `npx your-cli add theme` command would run
// for the nativewind engine. It never overwrites a user's global.css wholesale:
// - file doesn't exist  -> create a minimal one with your block
// - file exists, no block yet -> append your block
// - file exists, block already present -> replace only that block (safe re-run)

import fs from "node:fs";

const START =
  "/* your-lib:theme:start — do not edit by hand, regenerate via `npx your-cli update theme` */";
const END = "/* your-lib:theme:end */";

export function injectThemeBlock(targetPath: string, block: string) {
  const exists = fs.existsSync(targetPath);
  const base = exists
    ? fs.readFileSync(targetPath, "utf-8")
    : "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n";

  const wrapped = `${START}\n${block}\n${END}`;
  const hasBlock = base.includes(START);
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const next = hasBlock
    ? base.replace(
        new RegExp(`${escapeRegExp(START)}[\\s\\S]*?${escapeRegExp(END)}`),
        wrapped,
      )
    : `${base.trimEnd()}\n\n${wrapped}\n`;

  fs.writeFileSync(targetPath, next);
  console.log(exists ? "✓ updated theme block in global.css" : "✓ created global.css");
}
