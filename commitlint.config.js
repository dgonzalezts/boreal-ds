import customRules from "./commitlint-custom-rules.js";

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: customRules.rules,
    },
  ],
  prompt: {
    settings: {
      enableMultipleScopes: false,
    },
    questions: {
      subject: {
        description:
          "Write subject starting with ticket ID (e.g., EOA-9606 add feature) or '* ' for non-ticket changes (e.g., * add feature) [REQUIRED]",
      },
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "test",
        "docs",
        "build",
        "ci",
        "refactor",
        "revert",
        "style",
        "perf",
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        // Packages
        "react",
        "vue",
        "web-components",
        "styles",
        // Apps & Tools
        "docs",
        "examples",
        "scripts",
        // Monorepo
        "workspace",
        "ci",
        "deps",
        "release",
        "multiple",
      ],
    ],
    // Disable built-in rules in favor of custom ones with better error messages
    "type-empty": [0],
    "scope-empty": [0],
    "subject-empty": [0],
    // Custom rules with descriptive error messages
    "type-required": [2, "always"],
    "scope-required": [2, "always"],
    "subject-required": [2, "always"],
    "ticket-format": [2, "always"],
    "body-max-line-length": [2, "always", 300],
    "subject-case": [0],
    "header-max-length": [2, "always", 100],
    "subject-full-stop": [2, "never", "."],
  },
};
