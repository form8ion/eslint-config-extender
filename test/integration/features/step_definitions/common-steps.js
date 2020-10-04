import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import nock from 'nock';
import td from 'testdouble';
import {prompt, scaffold as githubScaffolder} from '@travi/github-scaffolder';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

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

  this.shell = td.replace('shelljs');
  this.execa = td.replace('execa');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const configExtender = require('@form8ion/eslint-config-extender');
  const projectScaffolder = require('@travi/project-scaffolder');
  const jsScaffolder = require('@travi/javascript-scaffolder');
  extendEslintConfig = configExtender.extendEslintConfig;
  scaffoldEslintConfig = configExtender.scaffold;
  pluginName = configExtender.PLUGIN_NAME;
  projectQuestionNames = projectScaffolder.questionNames;
  jsQuestionNames = jsScaffolder.questionNames;
  scaffoldJs = jsScaffolder.scaffold;

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
  const gitHubVcsHostChoice = 'GitHub';

  try {
    await extendEslintConfig(
      {
        decisions: {
          [projectQuestionNames.PROJECT_NAME]: this.projectName,
          [projectQuestionNames.DESCRIPTION]: any.sentence(),
          [projectQuestionNames.VISIBILITY]: any.fromList(['Public', 'Private']),
          [projectQuestionNames.GIT_REPO]: true,
          [projectQuestionNames.REPO_HOST]: gitHubVcsHostChoice,
          [projectQuestionNames.REPO_OWNER]: any.word(),
          [jsQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
          [jsQuestionNames.AUTHOR_NAME]: any.word(),
          [jsQuestionNames.AUTHOR_EMAIL]: any.email(),
          [jsQuestionNames.AUTHOR_URL]: any.url(),
          [jsQuestionNames.CI_SERVICE]: 'Other',
          [jsQuestionNames.SCOPE]: this.scope
        },
        vcsHosts: {[gitHubVcsHostChoice]: {scaffolder: githubScaffolder, prompt}}
      },
      decisions => options => scaffoldJs({
        ...options,
        unitTestFrameworks: {},
        packageTypes: {[pluginName]: {scaffolder: scaffoldEslintConfig}},
        decisions
      })
    );
  } catch (e) {
    debug(e);
    throw e;
  }
});
