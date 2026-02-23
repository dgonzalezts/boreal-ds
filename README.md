# Boreal DS

New Proximus Group Design System

## Prerequisites

| Tool    | Version | Notes                                                                    |
| ------- | ------- | ------------------------------------------------------------------------ |
| Node.js | 22+     | Use [fnm](https://github.com/Schniz/fnm) for automatic version switching |
| pnpm    | 10+     | Workspace package manager                                                |

### Node.js setup (fnm)

```bash
# Install fnm (if not already installed)
# macOS/Linux:
brew install fnm
# Or use: curl -fsSL https://fnm.vercel.app/install | bash

# Set up automatic version switching (recommended)
# Add the appropriate command to your shell profile:
eval "$(fnm env --use-on-cd --shell zsh)"  # For zsh (default on macOS)

# Install the Node.js version declared in .node-version
fnm install

# Verify
node --version
# → v22.21.1
```

**Shell-specific configuration:**

The `--use-on-cd` flag works across all operating systems (macOS, Linux, Windows), but requires shell-specific setup:

| Shell      | Config File                      | Command                                                                     |
| ---------- | -------------------------------- | --------------------------------------------------------------------------- |
| Zsh        | `~/.zshrc`                       | `eval "$(fnm env --use-on-cd --shell zsh)"`                                 |
| Bash       | `~/.bashrc`                      | `eval "$(fnm env --use-on-cd --shell bash)"`                                |
| Fish       | `~/.config/fish/conf.d/fnm.fish` | `fnm env --use-on-cd --shell fish \| source`                                |
| PowerShell | `$PROFILE`                       | `fnm env --use-on-cd --shell powershell \| Out-String \| Invoke-Expression` |

**How it works:**

- ✅ **Navigation**: Automatically switches Node.js versions when you `cd` into any monorepo folder with `.node-version`
- ⚠️ **Opening terminal directly in the workspace/monorepo root**: Requires running `fnm use` once in that session

### pnpm setup

```bash
# Install pnpm if not already available
npm install -g pnpm

# Verify
pnpm --version
# → 10.x.x
```

---

## Installation

Always install from the **workspace root**. A single `pnpm-lock.yaml` governs the entire monorepo.

```bash
pnpm install
```

> **⚠️ Migrating from npm?**
> If you previously used npm, you must remove all `node_modules` directories and `package-lock.json` files before running `pnpm install`:
>
> ```bash
> # macOS / Linux / Git Bash
> find . -name "node_modules" -type d -prune -exec rm -rf '{}' + && find . -name "package-lock.json" -type f -delete
>
> # Windows (PowerShell)
> Get-ChildItem -Path . -Include node_modules,package-lock.json -Recurse -Force | Remove-Item -Force -Recurse
> ```

To add a dependency to a specific package, use `--filter` from the root — never run `pnpm install` inside a subdirectory:

```bash
# Add a dev dependency to a specific package
pnpm add -D <package> --filter @telesign/boreal-web-components

# Add a runtime dependency
pnpm add <package> --filter @telesign/boreal-react

# Add a root-level dev dependency (tooling, hooks, etc.)
pnpm add -D -w <package>
```

---

## Project Structure

```
boreal-ds/
├── packages/
│   ├── boreal-web-components/    # @telesign/boreal-web-components — Stencil web components
│   ├── boreal-react/             # @telesign/boreal-react — React wrappers
│   ├── boreal-vue/               # @telesign/boreal-vue — Vue wrappers
│   └── boreal-styleguidelines/   # @telesign/boreal-style-guidelines — Design tokens (CSS/SCSS)
├── apps/
│   └── boreal-docs/              # @telesign/boreal-docs — Storybook documentation (not published)
├── examples/
│   └── react-testapp/            # react-testapp — React integration sandbox (not published)
├── .husky/                       # Git hooks (pre-commit, commit-msg, pre-push)
├── commitlint.config.js          # Commit message rules
├── .lintstagedrc.js              # Lint-staged configuration
├── turbo.json                    # Turborepo task pipeline
├── pnpm-workspace.yaml           # Workspace package globs
└── package.json                  # Root scripts and tooling dependencies
```

---

## Scripts

All scripts are run from the **workspace root** using Turborepo to orchestrate the task pipeline across packages.

| Script                    | Command                                           | Description                                                                                   |
| ------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm build`              | `turbo run build`                                 | Build all packages in dependency order                                                        |
| `pnpm test`               | `turbo run test`                                  | Run tests for all packages                                                                    |
| `pnpm lint`               | `turbo run lint`                                  | Lint all packages                                                                             |
| `pnpm lint:fix`           | `turbo run lint:fix`                              | Auto-fix lint issues across all packages                                                      |
| `pnpm format`             | `turbo run format`                                | Format all source files                                                                       |
| `pnpm format:check`       | `turbo run format:check`                          | Check formatting without writing                                                              |
| `pnpm dev`                | `turbo run dev`                                   | Start all dev servers concurrently (see note below)                                           |
| `pnpm dev:components`     | `--filter boreal-web-components`                  | Start only web components dev server (Stencil `--dev --watch`, incomplete dist)               |
| `pnpm dev:docs`           | `turbo run dev --filter=@telesign/boreal-docs`    | **Recommended** — full production build of `boreal-web-components` first, then Storybook only |
| `pnpm clean:wc`           | `rm -rf dist .stencil` in `boreal-web-components` | Remove Stencil build output and incremental cache                                             |
| `pnpm generate:component` | `--filter boreal-web-components`                  | Interactive prompt to create a new web component                                              |
| `pnpm generate:story`     | `--filter boreal-docs`                            | Interactive prompt to create a new Storybook story                                            |
| `pnpm rebuild:styles`     | `--filter boreal-style-guidelines`                | Rebuild design tokens and CSS (after token changes)                                           |
| `pnpm commit`             | `cz`                                              | Interactive commit prompt (enforces commit convention)                                        |
| `pnpm changeset`          | `changeset`                                       | Create a new changeset for upcoming release                                                   |
| `pnpm version-packages`   | `changeset version`                               | Bump versions and generate changelogs                                                         |
| `pnpm release`            | `turbo build + changeset publish`                 | Build and publish changed packages to npm                                                     |

To run a script for a single package only:

```bash
pnpm --filter @telesign/boreal-web-components build
pnpm --filter @telesign/boreal-docs dev
```

> **⚠️ Use `pnpm dev:docs` for Storybook, not `pnpm dev`**
>
> `pnpm dev:docs` runs `turbo run dev --filter=@telesign/boreal-docs`. Because the Turborepo `dev` task declares `"dependsOn": ["^build"]`, Turborepo first runs a full **production** build of `boreal-web-components` (`stencil build`, no `--dev`) — producing the complete `dist/` including `esm/`, `cjs/`, and `esm-es5/`. Then it starts **only** Storybook, leaving the production dist intact.
>
> `pnpm dev` also goes through Turborepo, but it starts `boreal-web-components#dev` (`stencil build --dev --watch --serve`) concurrently, which produces an **incomplete** `dist/` (no `esm-es5/`, and the Stencil incremental cache may skip `esm/` and `cjs/` entirely), eventually overwriting the production build.
>
> If you delete `dist/` manually, also delete `.stencil/` (the Stencil incremental cache) to prevent a partially cached rebuild:
>
> ```bash
> pnpm clean:wc   # removes dist/ and .stencil/ from boreal-web-components
> pnpm dev:docs   # full production build → then Storybook
> ```

---

## Commit Convention

All commits are enforced via commitlint and Husky. Use `pnpm commit` for an interactive prompt that guides you through the format.

### Format

```
type(scope): TICKET-ID description
```

For changes without a ticket:

```
type(scope): * description
```

### Valid Types

| Type       | Use for                                   |
| ---------- | ----------------------------------------- |
| `feat`     | New feature                               |
| `fix`      | Bug fix                                   |
| `docs`     | Documentation only                        |
| `refactor` | Code restructure without behaviour change |
| `test`     | Adding or updating tests                  |
| `chore`    | Maintenance, config, tooling              |
| `build`    | Build system or dependency changes        |
| `ci`       | CI/CD pipeline changes                    |
| `perf`     | Performance improvements                  |
| `style`    | Code style / formatting (no logic change) |
| `revert`   | Reverting a previous commit               |

### Valid Scopes

| Scope            | Package / Area                       |
| ---------------- | ------------------------------------ |
| `web-components` | `packages/boreal-web-components`     |
| `react`          | `packages/boreal-react`              |
| `vue`            | `packages/boreal-vue`                |
| `styles`         | `packages/boreal-styleguidelines`    |
| `docs`           | `apps/boreal-docs`                   |
| `examples`       | `examples/`                          |
| `workspace`      | Monorepo config, tooling, root files |
| `deps`           | Dependency updates                   |
| `ci`             | CI/CD configuration                  |
| `release`        | Release and publishing               |
| `scripts`        | Build or utility scripts             |
| `multiple`       | Changes spanning multiple packages   |

### Examples

```bash
feat(web-components): EOA-1234 add br-button component
fix(react): EOA-5678 correct prop types for BrButton
docs(workspace): * update README for pnpm monorepo setup
chore(deps): EOA-9999 bump stencil to v4.39
```

---

## Release Workflow

Releases are managed with [release-it](https://github.com/release-it/release-it) and driven by conventional commit history. Each package has its own `.release-it.json` config and must be released from the `release/current` branch.

### Release a single package

```bash
pnpm release:styles   # @telesign/boreal-style-guidelines
pnpm release:wc       # @telesign/boreal-web-components
pnpm release:react    # @telesign/boreal-react
pnpm release:vue      # @telesign/boreal-vue
```

### Release all packages in dependency order

```bash
pnpm release:all
```

### Dry run (preview without writing)

```bash
pnpm --filter @telesign/boreal-web-components run release -- --dry-run
```

---

## Adding a New Package

1. Create a directory under `packages/`, `apps/`, or `examples/` — the workspace globs (`packages/*`, `apps/*`, `examples/*`) pick it up automatically on the next `pnpm install`.

2. Add a `package.json` with the workspace name convention:

```json
{
  "name": "@telesign/boreal-my-package",
  "version": "0.0.1",
  "publishConfig": { "access": "public" }
}
```

3. Run `pnpm install` from the workspace root to link it into the graph.

4. If the package should **not** be versioned or published, add its name to the `ignore` array in `.changeset/config.json`.
