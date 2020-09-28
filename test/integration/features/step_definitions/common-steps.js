import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import nock from 'nock';
import td from 'testdouble';
import {prompt, scaffold as githubScaffolder} from '@travi/github-scaffolder';
import any from '@travi/any';
import {After, Before, When} from 'cucumber';

let extendEslintConfig, projectQuestionNames, jsQuestionNames, scaffoldJs;
const debug = require('debug')('test');

Before(async function () {
  nock.disableNetConnect();

  this.shell = td.replace('shelljs');
  this.execa = td.replace('execa');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const configExtender = require('@form8ion/eslint-config-extender');
  const projectScaffolder = require('@travi/project-scaffolder');
  const jsScaffolder = require('@travi/javascript-scaffolder');
  extendEslintConfig = configExtender.extendEslintConfig;
  projectQuestionNames = projectScaffolder.questionNames;
  jsQuestionNames = jsScaffolder.questionNames;
  scaffoldJs = jsScaffolder.scaffold;

  stubbedFs({
    node_modules: {
      ...stubbedFs.load(resolve(__dirname, '../../../../', 'node_modules')),
      'validate-npm-package-name': {
        node_modules: {
          builtins: {
            'builtins.json': JSON.stringify(any.listOf(any.word))
          }
        }
      }
    }
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
          [projectQuestionNames.PROJECT_NAME]: any.word(),
          [projectQuestionNames.DESCRIPTION]: any.sentence(),
          [projectQuestionNames.VISIBILITY]: any.fromList(['Public', 'Private']),
          [projectQuestionNames.GIT_REPO]: true,
          [projectQuestionNames.REPO_HOST]: gitHubVcsHostChoice,
          [projectQuestionNames.REPO_OWNER]: any.word()
        },
        vcsHosts: {[gitHubVcsHostChoice]: {scaffolder: githubScaffolder, prompt}}
      },
      decisions => options => scaffoldJs({
        ...options,
        unitTestFrameworks: {},
        decisions: {
          ...decisions,
          [jsQuestionNames.NODE_VERSION_CATEGORY]: 'LTS',
          [jsQuestionNames.AUTHOR_NAME]: any.word(),
          [jsQuestionNames.AUTHOR_EMAIL]: any.email(),
          [jsQuestionNames.AUTHOR_URL]: any.url(),
          ciService: 'Other'
        }
      })
    );
  } catch (e) {
    debug(e);
    throw e;
  }
});
