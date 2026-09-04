const fs = require("fs");
const path = require("path");

const REGISTRY_DIR = path.join(__dirname, "../registry/mobile");
const OUTPUT_DIR = path.join(__dirname, "../__registry__");

// Helper function to recursively find all .json files in a directory
function getJsonFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;

    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getJsonFiles(fullPath, fileList);
        } else if (file.endsWith(".json")) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

function buildRegistry(engine) {
    const enginePath = path.join(REGISTRY_DIR, engine);
    const registryFiles = getJsonFiles(enginePath);
    const registryData = [];

    for (const filePath of registryFiles) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        try {
            const json = JSON.parse(fileContent);
            registryData.push(json);
        } catch (err) {
            console.error(`Error parsing JSON in file: ${filePath}`, err);
        }
    }

    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write the master JSON file
    const outputPath = path.join(OUTPUT_DIR, `mobile-${engine}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(registryData, null, 2));

    console.log(
        `✅ Built ${engine} registry: ${registryData.length} items successfully compiled.`,
    );
}

// Run the builder for both engines
console.log("Starting registry build...");
buildRegistry("nativewind");
buildRegistry("stylesheet");
