# React Apps UI 🚀

![NPM Version](https://img.shields.io/npm/v/react-apps-ui?color=blue&style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dt/react-apps-ui?color=green&style=for-the-badge)
![GitHub License](https://img.shields.io/github/license/anandvyas2021/react-apps-ui-registry?style=for-the-badge)

Beautiful, highly customizable UI components designed for a seamless developer experience across **Web and Mobile**. 

Inspired by the Shadcn/UI philosophy, **this is not a traditional component library you install via npm.** Instead, it is a universal collection of reusable, premium components that download directly into your codebase, adapting to your specific framework and styling engine.

## The Philosophy

You should own your UI. Traditional NPM libraries lock you into their design systems, making deep customization a nightmare. This library takes a fundamentally different approach:

* **Total Ownership:** Components are copied directly into your local workspace. You have full control over the styling, physics, and logic.
* **Universal & Engine Agnostic:** Built from the ground up to natively support:
  * **Web:** React + Tailwind CSS (Next.js, Vite, etc.)
  * **Mobile:** React Native + NativeWind (Tailwind CSS)
  * **Mobile (Zero-Dependency):** React Native + standard `StyleSheet`
* **Smart CLI:** The `react-apps-ui` CLI recursively resolves nested dependencies (like icons or loaders), respects your path aliases, and automatically installs required NPM packages based on your selected engine.

---

## Prerequisites

Before using the CLI, ensure you have an existing React (Web) or React Native (Expo) project.

**Path Aliases:** This library uses the `@/` path alias to ensure imports never break if you move files around. Make sure your `tsconfig.json` (or `jsconfig.json`) at the root of your project is configured to support it:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
*(If you do not use a `src` folder, change `"./src/*"` to `"./*"`)*

---

## Quick Start

Get up and running in a fresh project in seconds.

### 1. Initialize the workspace
Run the `init` command at the root of your project. This interactive command lets you select your target platform (Web or Mobile) and styling engine, creates your base theme, and sets up your utility files.

```bash
npx react-apps-ui@latest init
```

### 2. Add a component
Use the `add` command to pull a component into your project. The CLI will automatically fetch the exact code needed for your specific engine, grab any sub-dependencies, and install necessary NPM packages.

```bash
npx react-apps-ui@latest add action-button
```

### 3. Import and customize
The code is now yours! You will find it beautifully organized in your project folder. Import it and modify it however you like.

```tsx
import { ActionButton } from "@/components/ui/action-button";

export default function App() {
  return (
    <ActionButton onPress="{()"> console.log("Pressed!")}>
      Click Me
    </ActionButton>
  );
}
```

---

## Folder Architecture

To keep your project pristine and scalable, the CLI intelligently routes components into domain-specific directories within your app:

* `components/ui/` - Core architectural building blocks (buttons, inputs, cards).
* `components/loaders/` - Foundational animations, skeletons, and loading states.
* `components/custom/` - Highly specialized, compound UI elements.
* `utils/` - Shared helpers and style-merging utilities optimized for your specific engine.

## License

This project is licensed under the [MIT License](LICENSE).
