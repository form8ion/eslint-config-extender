// #### Import
// remark-usage-ignore-next 4
import {resolve} from 'node:path';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import any from '@travi/any';
import {promptConstants} from '@form8ion/project';
import {packageManagers} from '@form8ion/javascript-core';

// remark-usage-ignore-next 13
const stubbedNodeModules = stubbedFs.load(resolve('node_modules'));
const error = new Error('Command failed with exit code 1: npm ls husky --json');
error.exitCode = 1;
error.stdout = JSON.stringify({});
error.command = 'npm ls husky --json';
const {execa} = await td.replaceEsm('execa');
td.when(execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
  .thenResolve({stdout: ['v16.5.4', ''].join('\n')});
td.when(execa('. ~/.nvm/nvm.sh && nvm install', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
td.when(execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
td.when(execa('npm run generate:md && npm test', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
td.when(execa('npm', ['whoami'])).thenResolve({stdout: any.word()});
td.when(execa('npm', ['--version'])).thenResolve({stdout: any.word()});

const javascriptPlugin = await import('@form8ion/javascript');
const {scaffold, extendEslintConfig} = await import('./lib/index.mjs');

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedNodeModules});

// #### Execute

const logger = {
  info: () => undefined,
  success: () => undefined,
  warn: () => undefined,
  error: () => undefined
};

// ##### Scaffolder Plugin

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    projectName: 'eslint-config-foo',
    scope: 'bar'
  });
})();

// ##### High-Level Scaffolder

(async () => {
  const {questionNames: jsQuestionNamesByPromptId, ids: jsPromptIds} = javascriptPlugin.promptConstants;
  const {questionNames: projectQuestionNamesByPromptId, ids: projectPromptIds} = promptConstants;

  const {
    PROJECT_NAME, LICENSE, VISIBILITY, DESCRIPTION, COPYRIGHT_HOLDER, COPYRIGHT_YEAR
  } = projectQuestionNamesByPromptId[projectPromptIds.BASE_DETAILS];
  const {GIT_REPO} = projectQuestionNamesByPromptId[projectPromptIds.GIT_REPOSITORY];
  const {REPO_HOST} = projectQuestionNamesByPromptId[projectPromptIds.REPOSITORY_HOST];
  const {
    AUTHOR_NAME, AUTHOR_EMAIL, AUTHOR_URL, SCOPE, PACKAGE_MANAGER, NODE_VERSION_CATEGORY, PROVIDE_EXAMPLE
  } = jsQuestionNamesByPromptId[jsPromptIds.BASE_DETAILS];

  // remark-usage-ignore-next 2
  // this package's own prompts, plus the remaining (unforced) javascript BASE_DETAILS answers the
  // wrapped prompt built by extendEslintConfig delegates back to this same base prompt
  const decisions = {
    [PROJECT_NAME]: 'eslint-config-foo',
    [DESCRIPTION]: 'a description of the project',
    [VISIBILITY]: 'OSS',
    [LICENSE]: 'MIT',
    [COPYRIGHT_HOLDER]: 'John Smith',
    [COPYRIGHT_YEAR]: '2022',
    [GIT_REPO]: true,
    [REPO_HOST]: 'foo',
    [AUTHOR_NAME]: 'John Smith',
    [AUTHOR_EMAIL]: 'john@smith.org',
    [AUTHOR_URL]: 'https://smith.org',
    [SCOPE]: 'org-name',
    [PACKAGE_MANAGER]: packageManagers.NPM,
    [NODE_VERSION_CATEGORY]: 'LTS',
    [PROVIDE_EXAMPLE]: false
  };
  const prompt = ({questions}) => Object.fromEntries(questions.map(({name}) => [name, decisions[name]]));

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
