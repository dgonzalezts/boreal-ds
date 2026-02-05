# Scripts (Boreal DS)

Utilities to build and package Boreal DS artifacts for local testing.

## Requirements

- Node.js 22.21.1 (see repo `.nvmrc`)

## Install

```bash
cd scripts-boreal
npm install
```

## Available commands

From `scripts-boreal/package.json`:

```bash
npm run create:pack-react
npm run create:pack-vue
npm run create:pack-angular
```

## What the pipeline does

The script `bin/publish.mjs` runs this flow:

1. Build `@boreal-ds/web-components`.
2. Pack it into a `.tgz` and install into the framework wrapper.
3. Build the wrapper package.
4. Pack the wrapper and install into the demo app (if present).
5. Run `npm run dev` for the demo app.

## Usage (manual)

```bash
node bin/publish.mjs <framework> [environment]
```

Examples:

```bash
node publish.mjs react
node publish.mjs vue dev
```

Supported frameworks: `vue`, `react`, `angular`.

## Notes

- npm exec boreal-pack -- react dev whit bin
- The repo currently includes the React demo app at `examples/react-testapp`.
- If a demo app path is missing, the script warns and skips demo install/run.
