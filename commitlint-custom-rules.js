/**
 * Custom commitlint rules plugin for Boreal Design System monorepo
 *
 * Enforces:
 * - Required type from allowed commit types (feat, fix, docs, etc.)
 * - Required scope from allowed monorepo packages/areas
 * - Required subject with proper format examples
 * - Ticket ID format in commit subjects (e.g., "EOA-9606 description")
 */
export default {
  rules: {
    "type-required": (parsed, when = "always") => {
      const { type, header } = parsed;

      const hasParsedType = type !== null && type !== undefined && type !== "";
      const hasHeaderType = header && /^[a-z]+(\(.+\))?:/.test(header);

      const hasType = hasParsedType || hasHeaderType;
      const isValid = when === "always" ? hasType : !hasType;
      const message = isValid
        ? ""
        : 'Type is required. Use one of: feat, fix, test, chore, docs, build, ci, refactor, revert, style, perf (e.g., "feat(react): EOA-9606 add button component")';

      return [isValid, message];
    },

    "ticket-format": (parsed, when = "always") => {
      const { subject } = parsed;

      if (!subject) {
        return [true];
      }

      const ticketRegex = /^[A-Z]+-\d+\s.+$/;
      const noTicketRegex = /^\*\s.+$/;
      const matches = ticketRegex.test(subject) || noTicketRegex.test(subject);

      const isValid = when === "always" ? matches : !matches;
      const message = isValid
        ? ""
        : 'Subject must start with ticket ID (e.g., "EOA-9606 add feature") or "* " for non-ticket changes (e.g, "* add feature")';

      return [isValid, message];
    },

    "scope-required": (parsed, when = "always") => {
      const { scope, header } = parsed;

      if (!header || !header.match(/^[a-z]+(\(.+\))?:/)) {
        return [true];
      }

      const hasParsedScope =
        scope !== null && scope !== undefined && scope !== "";
      const hasHeaderScope = header && /\(.+\):/.test(header);

      const hasScope = hasParsedScope || hasHeaderScope;
      const isValid = when === "always" ? hasScope : !hasScope;
      const message = isValid
        ? ""
        : 'Scope is required. Use one of: react, vue, web-components, styles, docs, examples, scripts, workspace, ci, deps, release, multiple (e.g., "feat(react): ...")';

      return [isValid, message];
    },

    "subject-required": (parsed, when = "always") => {
      const { subject, header } = parsed;

      if (!header || !header.match(/^[a-z]+(\(.+\))?:/)) {
        return [true];
      }

      const hasSubject =
        subject !== null && subject !== undefined && subject !== "";
      const isValid = when === "always" ? hasSubject : !hasSubject;
      const message = isValid
        ? ""
        : 'Subject is required. Format: "type(scope): TICKET-123 description" (e.g., "feat(react): EOA-9606 add button component")';

      return [isValid, message];
    },
  },
};
