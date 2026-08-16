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
import {promptConstants} from '@form8ion/project';
import {packageManagers} from '@form8ion/javascript-core';
```

```javascript
const javascriptPlugin = await import('@form8ion/javascript');
const {scaffold, extendEslintConfig} = await import('@form8ion/eslint-config-extender');
```

#### Execute

```javascript
const logger = {
  info: () => undefined,
  success: () => undefined,
  warn: () => undefined,
  error: () => undefined
};
```

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
  const {questionNames: jsQuestionNamesByPromptId, ids: jsPromptIds} = javascriptPlugin.promptConstants;
  const {questionNames: projectQuestionNamesByPromptId, ids: projectPromptIds} = promptConstants;

  const prompt = ({id}) => {
    switch (id) {
      case projectPromptIds.BASE_DETAILS: {
        const {
          PROJECT_NAME, LICENSE, VISIBILITY, DESCRIPTION, COPYRIGHT_HOLDER, COPYRIGHT_YEAR
        } = projectQuestionNamesByPromptId[projectPromptIds.BASE_DETAILS];

        return {
          [PROJECT_NAME]: 'eslint-config-foo',
          [DESCRIPTION]: 'a description of the project',
          [VISIBILITY]: 'OSS',
          [LICENSE]: 'MIT',
          [COPYRIGHT_HOLDER]: 'John Smith',
          [COPYRIGHT_YEAR]: '2022'
        };
      }
      case projectPromptIds.GIT_REPOSITORY:
        return {[projectQuestionNamesByPromptId[projectPromptIds.GIT_REPOSITORY].GIT_REPO]: true};
      case projectPromptIds.REPOSITORY_HOST:
        return {[projectQuestionNamesByPromptId[projectPromptIds.REPOSITORY_HOST].REPO_HOST]: 'foo'};
      case jsPromptIds.JAVASCRIPT_BASE_DETAILS: {
        const {
          AUTHOR_NAME, AUTHOR_EMAIL, AUTHOR_URL, SCOPE, PACKAGE_MANAGER, NODE_VERSION_CATEGORY, PROVIDE_EXAMPLE
        } = jsQuestionNamesByPromptId[jsPromptIds.JAVASCRIPT_BASE_DETAILS];

        return {
          [AUTHOR_NAME]: 'John Smith',
          [AUTHOR_EMAIL]: 'john@smith.org',
          [AUTHOR_URL]: 'https://smith.org',
          [SCOPE]: 'org-name',
          [PACKAGE_MANAGER]: packageManagers.NPM,
          [NODE_VERSION_CATEGORY]: 'LTS',
          [PROVIDE_EXAMPLE]: false
        };
      }
      default:
        throw new Error(`Unknown prompt: ${id}`);
    }
  };

  await extendEslintConfig(
    {
      plugins: {
        vcsHosts: {
          foo: {
            scaffold: ({projectName}) => ({
              vcs: {name: projectName, host: any.url(), owner: any.word(), ssh_url: any.url()}
            })
          }
        }
      }
    },
    dependencies => ({
      ...javascriptPlugin,
      scaffold: options => javascriptPlugin.scaffold({
        ...options,
        configs: {},
        plugins: {unitTestFrameworks: {}}
      }, dependencies),
      lift: options => javascriptPlugin.lift(options, dependencies),
      test: options => javascriptPlugin.test(options, dependencies)
    }),
    {prompt, logger}
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

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovate

[coverage-link]: https://codecov.io/github/form8ion/eslint-config-extender

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/eslint-config-extender/master?logo=codecov

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/eslint-config-extender.svg?logo=opensourceinitiative

[npm-link]: https://www.npmjs.com/package/@form8ion/eslint-config-extender

[npm-badge]: https://img.shields.io/npm/v/@form8ion/eslint-config-extender?logo=npm

[runkit-link]: https://npm.runkit.com/@form8ion/eslint-config-extender

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/eslint-config-extender.svg

[github-actions-ci-link]: https://github.com/form8ion/eslint-config-extender/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/eslint-config-extender/node-ci.yml.svg?branch=master&logo=github

[node-badge]: https://img.shields.io/node/v/@form8ion/eslint-config-extender?logo=node.js

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
