# Scripts (Boreal DS)

Utilities to build and package Boreal DS artifacts for local testing.

## Requirements

- Node.js 22.21.1 (see repo `.nvmrc`)

## Install

```bash
cd scripts
npm install
```

## Available commands

From `scripts/package.json`:

```bash
npm run create:pack-react
npm run create:pack-vue
npm run create:pack-angular
```

## What the pipeline does

The script `create-packages.mjs` runs this flow:

1. Build `@boreal-ds/web-components`.
2. Pack it into a `.tgz` and install into the framework wrapper.
3. Build the wrapper package.
4. Pack the wrapper and install into the demo app (if present).
5. Run `npm run dev` for the demo app.

## Usage (manual)

```bash
node create-packages.mjs <framework> [environment]
```

Examples:

```bash
node create-packages.mjs react
node create-packages.mjs vue dev
```

Supported frameworks: `vue`, `react`, `angular`.

## Notes

- The repo currently includes the React demo app at `examples/react-testapp`.
- If a demo app path is missing, the script warns and skips demo install/run.
