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
                let finalTargetPath = path.join(process.cwd(), file.target);

                // SMART ROUTING: If they use 'src/' and it's not a root config file, put it inside src/
                const isRootConfig =
                    file.target.includes("tailwind") ||
                    file.target.endsWith(".config.js") ||
                    file.target.endsWith(".json");
                if (hasSrcDir && !isRootConfig) {
                    finalTargetPath = path.join(
                        process.cwd(),
                        "src",
                        file.target,
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
                        const existingContent = fs.readFileSync(
                            finalTargetPath,
                            "utf-8",
                        );

                        // Only append if it doesn't already contain our theme variables to prevent infinite duplication
                        if (!existingContent.includes("--background:")) {
                            fs.appendFileSync(
                                finalTargetPath,
                                `\n/* React Apps UI Theme */\n${file.content}`,
                                "utf-8",
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
                    console.log(chalk.green(`  Created ${file.target}`));
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

program.parse();
