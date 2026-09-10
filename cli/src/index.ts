#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import fs from "fs";
import path from "path";

// base URL to GitHub Raw folder
const REGISTRY_URL =
    "https://raw.githubusercontent.com/anandvyas2021/react-apps-ui-registry/refs/heads/prod/__registry__";

const program = new Command();

program
    .name("react-apps-ui")
    .description("Add high-quality components to your React Native app")
    .version("1.0.0");

// --- THE INIT COMMAND ---
program
    .command("init")
    .description("Configure your Expo project and install the ThemeProvider")
    .action(async () => {
        console.log(chalk.blue("Welcome to React Apps UI!\n"));

        // Ask the user which engine they want
        const response = await prompts({
            type: "select",
            name: "engine",
            message: "Which styling engine are you using?",
            choices: [
                {
                    title: "StyleSheet (Zero dependencies)",
                    value: "mobile-stylesheet",
                },
                {
                    title: "NativeWind (Tailwind CSS)",
                    value: "mobile-nativewind",
                },
            ],
        });

        if (!response.engine) {
            console.log(chalk.red("Initialization cancelled."));
            return;
        }

        // 2. USE THE REGISTRY_URL to fetch the correct JSON manifest
        const manifestUrl = `${REGISTRY_URL}/${response.engine}.json`;
        console.log(chalk.dim(`\nFetching registry from GitHub...`));

        try {
            const res = await fetch(manifestUrl);
            if (!res.ok)
                throw new Error(`Failed to fetch registry: ${res.statusText}`);

            const registry = await res.json();

            // 3. Find the "theme" component inside the giant JSON
            const themeComponent = registry.find(
                (item: any) => item.name === "theme",
            );

            if (!themeComponent) {
                console.log(
                    chalk.red("Error: Could not find 'theme' in the registry."),
                );
                return;
            }

            console.log(chalk.green(`✓ Found theme provider. Installing...`));

            // Check if the user's project uses a 'src' directory
            const hasSrcDir = fs.existsSync(path.join(process.cwd(), "src"));

            // 4. Loop through the files and write them smartly
            for (const file of themeComponent.files) {
                // A. Force the target to be a string so it can never be undefined
                const safeTarget = String(
                    file.target || file.name || "unknown-file",
                );
                let finalTargetPath = path.join(process.cwd(), safeTarget);

                //B. Safely check includes on the guaranteed string
                const isRootConfig =
                    safeTarget.includes("tailwind") ||
                    safeTarget.endsWith(".config.js") ||
                    safeTarget.endsWith(".json");

                if (hasSrcDir && !isRootConfig) {
                    finalTargetPath = path.join(
                        process.cwd(),
                        "src",
                        safeTarget,
                    );
                }

                // Ensure the folder exists
                fs.mkdirSync(path.dirname(finalTargetPath), {
                    recursive: true,
                });

                // SAFE WRITE: Check if the file already exists
                if (fs.existsSync(finalTargetPath)) {
                    if (
                        file.type === "css" ||
                        finalTargetPath.endsWith(".css")
                    ) {
                        console.log(
                            chalk.yellow(
                                `  ⚠️  ${file.target} already exists. Appending theme variables safely...`,
                            ),
                        );

                        try {
                            // C. Read the file and forcefully convert it to a String
                            const rawContent = fs.readFileSync(
                                finalTargetPath,
                                "utf-8",
                            );
                            const safeExistingContent = String(
                                rawContent || "",
                            );

                            // D. Safely check includes (This line can no longer crash!)
                            if (
                                !safeExistingContent.includes("--background:")
                            ) {
                                fs.appendFileSync(
                                    finalTargetPath,
                                    `\n/* React Apps UI Theme */\n${file.content || ""}`,
                                    "utf-8",
                                );
                            }
                        } catch (err) {
                            console.log(
                                chalk.red(
                                    `  ❌ Error reading or appending to ${safeTarget}`,
                                ),
                            );
                        }
                    } else {
                        console.log(
                            chalk.yellow(
                                `  ⚠️  ${file.target} already exists. Skipping to prevent overwrite.`,
                            ),
                        );
                    }
                } else {
                    // File doesn't exist, safe to write normally
                    fs.writeFileSync(finalTargetPath, file.content, "utf-8");
                    console.log(chalk.green(`  Created ${safeTarget}`));
                }
            }

            console.log(chalk.blue("\n🎉 Initialization complete!"));
            console.log(
                chalk.dim(
                    "Wrap your app in the <ThemeProvider> to get started.",
                ),
            );
        } catch (error) {
            console.log(chalk.red(`\nFailed to initialize:`));
            console.error(error);
        }
    });

// --- THE ADD COMMAND ---
program
    .command("add [components...]")
    .description("Add components to your project")
    .action(async (components: string[]) => {
        if (!components || components.length === 0) {
            console.log(
                chalk.red(
                    "Please specify at least one component to add. (e.g., npx react-apps-ui add action-button)",
                ),
            );
            return;
        }

        // 1. SMART AUTO-DETECT: Check if they are using NativeWind by looking for the preset or config
        const hasTailwind =
            fs.existsSync(path.join(process.cwd(), "tailwind.config.js")) ||
            fs.existsSync(
                path.join(process.cwd(), "theme/tailwind-preset.js"),
            ) ||
            fs.existsSync(
                path.join(process.cwd(), "src/theme/tailwind-preset.js"),
            );

        const engine = hasTailwind ? "mobile-nativewind" : "mobile-stylesheet";

        console.log(chalk.dim(`\nDetected engine: ${engine}`));
        const manifestUrl = `${REGISTRY_URL}/${engine}.json`;

        try {
            // 2. Fetch the massive JSON database
            const res = await fetch(manifestUrl);
            if (!res.ok)
                throw new Error(`Failed to fetch registry: ${res.statusText}`);
            const registry = await res.json();

            // 3. RECURSIVE DEPENDENCY RESOLUTION
            // If action-button needs wave-dots-loader, this automatically grabs it!
            const componentsToAdd = new Set<string>();

            const resolveDependencies = (compName: string) => {
                if (componentsToAdd.has(compName)) return; // Prevent infinite loops
                componentsToAdd.add(compName);

                const compData = registry.find((c: any) => c.name === compName);
                if (compData && compData.registryDependencies) {
                    compData.registryDependencies.forEach(resolveDependencies);
                }
            };

            // Run the resolver for every component the user typed in the terminal
            components.forEach(resolveDependencies);

            // We don't need to reinstall the theme if it was pulled as a dependency
            componentsToAdd.delete("theme");

            console.log(
                chalk.blue(
                    `\nInstalling: ${Array.from(componentsToAdd).join(", ")}...`,
                ),
            );

            const hasSrcDir = fs.existsSync(path.join(process.cwd(), "src"));

            // 4. WRITE THE FILES
            for (const compName of componentsToAdd) {
                const compData = registry.find((c: any) => c.name === compName);
                if (!compData) {
                    console.log(
                        chalk.red(
                            `  ❌ Component '${compName}' not found in registry.`,
                        ),
                    );
                    continue;
                }

                for (const file of compData.files) {
                    const safeTarget = String(
                        file.target || file.name || "unknown-file",
                    );
                    let finalTargetPath = path.join(process.cwd(), safeTarget);

                    if (hasSrcDir) {
                        finalTargetPath = path.join(
                            process.cwd(),
                            "src",
                            safeTarget,
                        );
                    }

                    // Ensure the folder exists
                    fs.mkdirSync(path.dirname(finalTargetPath), {
                        recursive: true,
                    });

                    // Safe Write
                    if (!fs.existsSync(finalTargetPath)) {
                        fs.writeFileSync(
                            finalTargetPath,
                            file.content || "",
                            "utf-8",
                        );
                        console.log(chalk.green(`  Created ${safeTarget}`));
                    } else {
                        console.log(
                            chalk.yellow(
                                `  ⚠️  ${safeTarget} already exists. Skipping.`,
                            ),
                        );
                    }
                }
            }

            console.log(chalk.blue("\n🎉 Components installed successfully!"));
        } catch (error) {
            console.log(chalk.red(`\nFailed to add components:`));
            console.error(error);
        }
    });

program.parse();
