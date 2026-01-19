export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'bugfix', 'docs', 'build', 'ci', 'refactor', 'revert', 'style', 'chore', 'ticket', 'perf'],
    ],
  },
};
