const fg = require('fast-glob')

const getScopes = path => fg.sync('*', { cwd: path, onlyDirectories: true })

const scopes = [
  ...getScopes('packages'), // changes under packages
  ...getScopes('tools'), // changes under tools
  'docs', // changes under docs
  'style', // changes only includes base style
  'playground', // changes under playground
  'project', // changes under the whole project
  'other', // other changes
]

/*
 * type(scope): [subject] body
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'release',
        'revert',
        'style',
        'test',
      ],
    ],
    'scope-enum': [2, 'always', scopes],
    'scope-case': [2, 'always', 'camel-case'],
    'scope-empty': [1, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 72],
  },
  prompt: {
    settings: {},
    messages: {
      type: "Select the type of change that you're committing:",
      scope:
        'What is the scope of this change (e.g. components, composables or build):',
      subject:
        "Write a short, imperative tense description of the change (e.g. [component's name/composable's name] description):",
      body: "Provide a more detailed change description if necessary. Use '|' to break new line:\n",
      breaking:
        'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixesSelect:
        'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefix: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Confirm ?',
    },
    types: [
      {
        name: 'build:       🧱 Changes that affect the build system or external dependencies',
        value: 'build',
        emoji: '🧱',
      },
      {
        name: "chore:       🛠 Other changes that don't modify src or test files",
        value: 'chore',
        emoji: '🛠',
      },
      {
        name: 'ci:         ⚙️ Changes to our CI configuration files and scripts',
        value: 'ci',
        emoji: '⚙️',
      },
      {
        name: 'docs:        📖 Documentation only changes',
        value: 'docs',
        emoji: '📖',
      },
      {
        name: 'feat:       ✨ A new feature',
        value: 'feat',
        emoji: '✨',
      },
      {
        name: 'fix:         🐛 A bug fix',
        value: 'fix',
        emoji: '🐛',
      },
      {
        name: 'perf:        🚀 A code change that improves performance',
        value: 'perf',
        emoji: '🚀',
      },
      {
        name: 'refactor:    🔄 A code change that neither fixes a bug nor adds a feature',
        value: 'refactor',
        emoji: '🔄',
      },
      {
        name: 'release:     🎉 A version or a release',
        value: 'release',
        emoji: '🎉',
      },
      {
        name: 'revert:      ⏪ Reverts a previous commit',
        value: 'revert',
        emoji: '⏪',
      },
      {
        name: 'style:       🎨 Changes that do not affect the meaning of the code',
        value: 'style',
        emoji: '🎨',
      },
      {
        name: 'test:        🧪 Adding missing tests or correcting existing tests',
        value: 'test',
        emoji: '🧪',
      },
    ],
    allowEmptyScopes: true,
    allowEmptySubjects: true,
    minSubjectLength: 0,
    allowBreakingChanges: ['feat', 'fix'],
    skipQuestions: ['footer'],
  },
}
