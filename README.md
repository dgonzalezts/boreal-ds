# Boreal DS

New Proximus Group Design System

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | 22+ | Use [fnm](https://github.com/Schniz/fnm) for automatic version switching |
| pnpm | 10+ | Workspace package manager |

### Node.js setup (fnm)

```bash
# Install the version declared in .nvmrc
fnm install

# Verify
node --version
# → v22.x.x
```

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

| Script | Command | Description |
|---|---|---|
| `pnpm build` | `turbo run build` | Build all packages in dependency order |
| `pnpm test` | `turbo run test` | Run tests for all packages |
| `pnpm lint` | `turbo run lint` | Lint all packages |
| `pnpm lint:fix` | `turbo run lint:fix` | Auto-fix lint issues across all packages |
| `pnpm format` | `turbo run format` | Format all source files |
| `pnpm format:check` | `turbo run format:check` | Check formatting without writing |
| `pnpm dev` | `turbo run dev` | Start all dev servers concurrently |
| `pnpm commit` | `cz` | Interactive commit prompt (enforces commit convention) |
| `pnpm changeset` | `changeset` | Create a new changeset for upcoming release |
| `pnpm version-packages` | `changeset version` | Bump versions and generate changelogs |
| `pnpm release` | `turbo build + changeset publish` | Build and publish changed packages to npm |

To run a script for a single package only:

```bash
pnpm --filter @telesign/boreal-web-components build
pnpm --filter @telesign/boreal-docs dev
```

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

| Type | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code restructure without behaviour change |
| `test` | Adding or updating tests |
| `chore` | Maintenance, config, tooling |
| `build` | Build system or dependency changes |
| `ci` | CI/CD pipeline changes |
| `perf` | Performance improvements |
| `style` | Code style / formatting (no logic change) |
| `revert` | Reverting a previous commit |

### Valid Scopes

| Scope | Package / Area |
|---|---|
| `web-components` | `packages/boreal-web-components` |
| `react` | `packages/boreal-react` |
| `vue` | `packages/boreal-vue` |
| `styles` | `packages/boreal-styleguidelines` |
| `docs` | `apps/boreal-docs` |
| `examples` | `examples/` |
| `workspace` | Monorepo config, tooling, root files |
| `deps` | Dependency updates |
| `ci` | CI/CD configuration |
| `release` | Release and publishing |
| `scripts` | Build or utility scripts |
| `multiple` | Changes spanning multiple packages |

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
