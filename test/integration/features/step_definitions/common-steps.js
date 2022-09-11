import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import nock from 'nock';
import td from 'testdouble';
import {prompt, scaffold as githubScaffolder} from '@travi/github-scaffolder';
import any from '@travi/any';
import {After, Before, When} from '@cucumber/cucumber';

let pluginName, extendEslintConfig, scaffoldEslintConfig, projectQuestionNames, jsQuestionNames, scaffoldJs;
const debug = require('debug')('test');

Before(async function () {
  this.configName = any.word();
  this.projectName = `eslint-config-${this.configName}`;
  this.scope = any.word();

  nock.disableNetConnect();

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  require('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies

  this.execa = td.replace('@form8ion/execa-wrapper');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const configExtender = require('@form8ion/eslint-config-extender');
  const projectScaffolder = require('@form8ion/project');
  const jsPlugin = require('@form8ion/javascript');
  extendEslintConfig = configExtender.extendEslintConfig;
  scaffoldEslintConfig = configExtender.scaffold;
  pluginName = configExtender.PLUGIN_NAME;
  projectQuestionNames = projectScaffolder.questionNames;
  jsQuestionNames = jsPlugin.questionNames;
  scaffoldJs = jsPlugin.scaffold;

  stubbedFs({
    node_modules: stubbedFs.load(resolve(__dirname, '../../../../', 'node_modules'))
  });
});

After(() => {
  nock.enableNetConnect();
  nock.cleanAll();
  stubbedFs.restore();
  td.reset();
});

When('the high-level scaffolder is executed', async function () {
  const {packageManagers} = require('@form8ion/javascript-core');

  const gitHubVcsHostChoice = 'GitHub';
  const visibility = any.fromList(['Public', 'Private']);
  const {scope} = this;

  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);

  try {
    await extendEslintConfig(
      {
        decisions: {
          [projectQuestionNames.PROJECT_NAME]: this.projectName,
          [projectQuestionNames.DESCRIPTION]: any.sentence(),
          [projectQuestionNames.VISIBILITY]: visibility,
          [projectQuestionNames.GIT_REPO]: true,
          [projectQuestionNames.REPO_HOST]: gitHubVcsHostChoice,
          [projectQuestionNames.REPO_OWNER]: any.word(),
          ...'Public' === visibility && {
            [projectQuestionNames.LICENSE]: 'MIT',
            [projectQuestionNames.COPYRIGHT_HOLDER]: any.word(),
            [projectQuestionNames.COPYRIGHT_YEAR]: 2000
          },
          ...'Private' === visibility && {[projectQuestionNames.UNLICENSED]: true},
          [jsQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
          [jsQuestionNames.AUTHOR_NAME]: any.word(),
          [jsQuestionNames.AUTHOR_EMAIL]: any.email(),
          [jsQuestionNames.AUTHOR_URL]: any.url(),
          [jsQuestionNames.CI_SERVICE]: 'Other',
          [jsQuestionNames.PACKAGE_MANAGER]: packageManagers.NPM,
          [jsQuestionNames.SCOPE]: scope,
          [jsQuestionNames.PROVIDE_EXAMPLE]: false
        },
        vcsHosts: {[gitHubVcsHostChoice]: {scaffolder: githubScaffolder, prompt}}
      },
      decisions => options => scaffoldJs({
        ...options,
        unitTestFrameworks: {},
        packageTypes: {[pluginName]: {scaffolder: scaffoldEslintConfig}},
        configs: {eslint: {scope: `@${any.word()}`}},
        decisions
      })
    );
  } catch (e) {
    debug(e);
    throw e;
  }
});
