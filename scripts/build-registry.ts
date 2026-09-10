// scripts/build-registry.ts
//
// Run: npx ts-node scripts/build-registry.ts
//
// Reads every *.json descriptor in /registry, inlines the referenced source
// files, and writes two flattened, installable manifests. These are what a
// real CLI (`npx your-cli add action-button`) would fetch — never hand-edit
// the __registry__ output.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");
const REGISTRY_DIR = path.join(ROOT, "registry");
const COMPONENTS_DIR = path.join(REGISTRY_DIR, "components");
const OUT_DIR = path.join(ROOT, "__registry__");
// Engine keys here must exactly match the keys used in registry/components/*.json
// "engines" objects. Adding a platform later (e.g. web) is a one-line change:
//   const ENGINES = ["mobile-nativewind", "mobile-stylesheet", "web-tailwind"] as const;
// No other change to this script is needed — any descriptor missing that key
// is simply skipped for that output file.
const ENGINES = ["mobile-nativewind", "mobile-stylesheet"] as const;

interface RegistryFile {
    name: string;
    url: string;
    type?: string;
    target?: string;
}

interface EngineEntry {
    dependencies: string[];
    registryDependencies: string[];
    files: RegistryFile[];
}

interface ComponentMeta {
    name: string;
    category: string;
    engines: Partial<Record<(typeof ENGINES)[number], EngineEntry>>;
}

function readComponentMetas(): ComponentMeta[] {
    return fs
        .readdirSync(COMPONENTS_DIR)
        .filter((f) => f.endsWith(".json"))
        .map((f) =>
            JSON.parse(fs.readFileSync(path.join(COMPONENTS_DIR, f), "utf-8")),
        );
}

function inlineFiles(entry: EngineEntry) {
    return entry.files.map((file) => ({
        ...file,
        content: fs.readFileSync(path.join(REGISTRY_DIR, file.url), "utf-8"),
    }));
}

function build() {
    const metas = readComponentMetas();
    fs.mkdirSync(OUT_DIR, { recursive: true });

    for (const engine of ENGINES) {
        const items = metas
            .filter((m) => m.engines[engine])
            .map((m) => {
                const entry = m.engines[engine]!;
                return {
                    name: m.name,
                    category: m.category,
                    dependencies: entry.dependencies,
                    registryDependencies: entry.registryDependencies,
                    files: inlineFiles(entry),
                };
            });

        const outPath = path.join(OUT_DIR, `${engine}.json`);
        fs.writeFileSync(outPath, JSON.stringify(items, null, 2));
        console.log(
            `✓ built ${path.relative(ROOT, outPath)} (${items.length} items)`,
        );
    }
}

build();
