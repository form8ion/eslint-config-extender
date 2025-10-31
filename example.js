// #### Import
// remark-usage-ignore-next 4
import {resolve} from 'node:path';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import any from '@travi/any';
import {promptConstants} from '@form8ion/project';

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

const {packageManagers} = await import('@form8ion/javascript-core');
const {questionNames: projectQuestionNames} = await import('@form8ion/project');
const javascriptPlugin = await import('@form8ion/javascript');
const {scaffold, extendEslintConfig} = await import('./lib/index.mjs');

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedNodeModules});

// #### Execute

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
  await extendEslintConfig(
    {
      decisions: {
        [javascriptPlugin.questionNames.AUTHOR_NAME]: 'John Smith',
        [javascriptPlugin.questionNames.AUTHOR_EMAIL]: 'john@smith.org',
        [javascriptPlugin.questionNames.AUTHOR_URL]: 'https://smith.org',
        [javascriptPlugin.questionNames.SCOPE]: 'org-name',
        [javascriptPlugin.questionNames.PACKAGE_MANAGER]: packageManagers.NPM,
        [javascriptPlugin.questionNames.NODE_VERSION_CATEGORY]: 'LTS',
        [javascriptPlugin.questionNames.CI_SERVICE]: 'Other',
        [javascriptPlugin.questionNames.PROVIDE_EXAMPLE]: false
      },
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
    decisions => ({
      ...javascriptPlugin,
      scaffold: options => javascriptPlugin.scaffold({
        ...options,
        decisions,
        configs: {},
        plugins: {unitTestFrameworks: {}}
      })
    }),
    {
      prompt: ({id}) => {
        switch (id) {
          case promptConstants.ids.BASE_DETAILS:
            return {
              [projectQuestionNames.PROJECT_NAME]: 'eslint-config-foo',
              [projectQuestionNames.DESCRIPTION]: 'a description of the project',
              [projectQuestionNames.VISIBILITY]: 'Public',
              [projectQuestionNames.LICENSE]: 'MIT',
              [projectQuestionNames.COPYRIGHT_HOLDER]: 'John Smith',
              [projectQuestionNames.COPYRIGHT_YEAR]: '2022'
            };
          case promptConstants.ids.GIT_REPOSITORY:
            return {[projectQuestionNames.GIT_REPO]: true};
          case promptConstants.ids.REPOSITORY_HOST:
            return {[projectQuestionNames.REPO_HOST]: 'foo'};
          default:
            throw new Error(`Unknown prompt: ${id}`);
        }
      }
    }
  );
})();
