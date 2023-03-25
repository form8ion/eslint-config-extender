// #### Import
// remark-usage-ignore-next 4
import {resolve} from 'node:path';
import stubbedFs from 'mock-fs';
import * as td from 'testdouble';
import any from '@travi/any';

// remark-usage-ignore-next 12
const stubbedNodeModules = stubbedFs.load(resolve('node_modules'));
const error = new Error('Command failed with exit code 1: npm ls husky --json');
error.exitCode = 1;
error.stdout = JSON.stringify({});
error.command = 'npm ls husky --json';
const {default: execa} = await td.replaceEsm('@form8ion/execa-wrapper');
td.when(execa('. ~/.nvm/nvm.sh && nvm ls-remote --lts', {shell: true}))
  .thenResolve({stdout: ['v16.5.4', ''].join('\n')});
td.when(execa('. ~/.nvm/nvm.sh && nvm install', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
td.when(execa('npm', ['ls', 'husky', '--json'])).thenReject(error);
td.when(execa('npm run generate:md && npm test', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
td.when(execa('npm', ['whoami'])).thenResolve({stdout: any.word()});

const {packageManagers} = await import('@form8ion/javascript-core');
const {questionNames: projectQuestionNames} = await import('@form8ion/project');
const {scaffold: javascriptScaffolder, questionNames: jsQuestionNames} = await import('@form8ion/javascript');
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
        [projectQuestionNames.PROJECT_NAME]: 'eslint-config-foo',
        [projectQuestionNames.DESCRIPTION]: 'a description of the project',
        [projectQuestionNames.VISIBILITY]: 'Public',
        [projectQuestionNames.LICENSE]: 'MIT',
        [projectQuestionNames.COPYRIGHT_HOLDER]: 'John Smith',
        [projectQuestionNames.COPYRIGHT_YEAR]: '2022',
        [projectQuestionNames.GIT_REPO]: true,
        [projectQuestionNames.REPO_HOST]: 'GitHub',
        [projectQuestionNames.REPO_OWNER]: 'org-name',
        [jsQuestionNames.AUTHOR_NAME]: 'John Smith',
        [jsQuestionNames.AUTHOR_EMAIL]: 'john@smith.org',
        [jsQuestionNames.AUTHOR_URL]: 'https://smith.org',
        [jsQuestionNames.SCOPE]: 'org-name',
        [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM,
        [jsQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
        [jsQuestionNames.CI_SERVICE]: 'Other',
        [jsQuestionNames.PROVIDE_EXAMPLE]: false
      },
      vcsHosts: {
        GitHub: {
          scaffolder: options => options,
          prompt: ({decisions}) => ({[projectQuestionNames.REPO_OWNER]: decisions[projectQuestionNames.REPO_OWNER]})
        }
      }
    },
    decisions => options => javascriptScaffolder({...options, decisions, unitTestFrameworks: {}})
  );
})();
