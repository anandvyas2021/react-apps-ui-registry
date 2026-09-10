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

            // 4. Loop through the files (tokens.ts and ThemeProvider.tsx) and create them!
            for (const file of themeComponent.files) {
                // file.target is exactly what we wrote earlier (e.g., "theme/tokens.ts")
                const targetPath = path.join(process.cwd(), file.target);

                // Ensure the folder exists (e.g., creates the "theme/" folder if it doesn't exist)
                fs.mkdirSync(path.dirname(targetPath), { recursive: true });

                // Write the raw React code to their hard drive!
                fs.writeFileSync(targetPath, file.content, "utf-8");

                console.log(chalk.green(`Created ${file.target}`));
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
