# eslint-config-extender

[shareable](https://eslint.org/docs/developer-guide/shareable-configs#shareable-configs)
[ESLint](https://eslint.org) config scaffolder for extending another config

<!--status-badges start -->

[![Codecov][coverage-badge]][coverage-link]
[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
      * [Scaffolder Plugin](#scaffolder-plugin)
      * [High-Level Scaffolder](#high-level-scaffolder)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try @form8ion/eslint-config-extender on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/eslint-config-extender --save-prod
```

### Example

#### Import

```javascript
const {packageManagers} = await import('@form8ion/javascript-core');
const githubPlugin = await import('@form8ion/github');
const {questionNames: projectQuestionNames} = await import('@form8ion/project');
const javascriptPlugin = await import('@form8ion/javascript');
const {scaffold, extendEslintConfig} = await import('./lib/index.mjs');
```

#### Execute

##### Scaffolder Plugin

```javascript
(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    projectName: 'eslint-config-foo',
    scope: 'bar'
  });
})();
```

##### High-Level Scaffolder

```javascript
(async () => {
  await extendEslintConfig(
    {
      decisions: {
        [projectQuestionNames.PROJECT_NAME]: 'eslint-config-foo',
        [projectQuestionNames.DESCRIPTION]: 'a description of the project',
        [projectQuestionNames.VISIBILITY]: 'Public',
        [projectQuestionNames.LICENSE]: 'MIT',
        [projectQuestionNames.COPYRIGHT_HOLDER]: 'John Smith',
        [projectQuestionNames.COPYRIGHT_YEAR]: '2022',
        [projectQuestionNames.GIT_REPO]: true,
        [projectQuestionNames.REPO_HOST]: 'GitHub',
        [projectQuestionNames.REPO_OWNER]: 'org-name',
        [javascriptPlugin.questionNames.AUTHOR_NAME]: 'John Smith',
        [javascriptPlugin.questionNames.AUTHOR_EMAIL]: 'john@smith.org',
        [javascriptPlugin.questionNames.AUTHOR_URL]: 'https://smith.org',
        [javascriptPlugin.questionNames.SCOPE]: 'org-name',
        [javascriptPlugin.questionNames.PACKAGE_MANAGER]: packageManagers.NPM,
        [javascriptPlugin.questionNames.NODE_VERSION_CATEGORY]: 'LTS',
        [javascriptPlugin.questionNames.CI_SERVICE]: 'Other',
        [javascriptPlugin.questionNames.PROVIDE_EXAMPLE]: false
      },
      plugins: {vcsHosts: {GitHub: githubPlugin}}
    },
    decisions => ({
      ...javascriptPlugin,
      scaffold: options => javascriptPlugin.scaffold({
        ...options,
        decisions,
        configs: {},
        plugins: {unitTestFrameworks: {}}
      })
    })
  );
})();
```

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[coverage-link]: https://codecov.io/github/form8ion/eslint-config-extender

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/eslint-config-extender?logo=codecov

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/eslint-config-extender.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/eslint-config-extender

[npm-badge]: https://img.shields.io/npm/v/@form8ion/eslint-config-extender?logo=npm

[runkit-link]: https://npm.runkit.com/@form8ion/eslint-config-extender

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/eslint-config-extender.svg

[github-actions-ci-link]: https://github.com/form8ion/eslint-config-extender/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/eslint-config-extender/node-ci.yml.svg?branch=master&logo=github

[node-badge]: https://img.shields.io/node/v/@form8ion/eslint-config-extender?logo=node.js

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
