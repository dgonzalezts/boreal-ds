export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'build', 'ci', 'refactor', 'revert', 'style', 'chore', 'ticket', 'perf'],
    ],
  },
};
