# scripts-boreal

Pipeline utilities for packing and validating Boreal DS artifacts before publishing.

Builds each package, packs it as a real `.tgz` artifact, and installs it into the framework wrapper and demo app — bypassing workspace symlinks to validate `exports`, `files`, and `publishConfig` exactly as consumers will see them.

## Requirements

- Node.js 22.x (see `.node-version` at the repo root)
- pnpm 10.x

No separate install step is needed. `scripts-boreal` is a pnpm workspace member and its dependencies are installed automatically when you run `pnpm install` from the repo root.

## Available commands

Run from the **workspace root**:

```bash
# CI validation — packs artifacts and runs a build against them
pnpm validate:pack

# Local dev — packs artifacts and starts the demo app
node scripts-boreal/bin/publish.js react
```

## What the pipeline does

The script `bin/publish.js` runs this flow for a given framework:

1. Pack `@telesign/boreal-web-components` into a `.tgz` and copy it to the wrapper.
2. Install the `.tgz` into the framework wrapper (e.g. `@telesign/boreal-react`).
3. Build the wrapper using `pnpm build`.
4. Pack the wrapper into a `.tgz` and copy it to the demo app.
5. Install the wrapper `.tgz` into the demo app.
6. In CI (`--ci` flag): run `pnpm build` in the demo app to validate the artifact.
   Locally: run `pnpm dev` to start the demo app.

> Turborepo handles the actual build of `@telesign/boreal-web-components` as part of the normal workspace build pipeline. This script only packs already-built artifacts.

## Usage (manual)

```bash
node scripts-boreal/bin/publish.js <framework> [--ci]
```

Examples:

```bash
node scripts-boreal/bin/publish.js react
node scripts-boreal/bin/publish.js react --ci
```

Supported frameworks: `vue`, `react`, `angular`.

## Notes

- The repo currently includes the React demo app at `examples/react-testapp`.
- Vue and Angular demo apps will be added in a future iteration; the pipeline already supports them via `CONFIG`.
