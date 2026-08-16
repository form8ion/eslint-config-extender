import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {promptConstants} from '@form8ion/project';

import stubbedFs from 'mock-fs';
import nock from 'nock';
import * as td from 'testdouble';
import any from '@travi/any';
import {After, Before, When} from '@cucumber/cucumber';
import testDebug from 'debug';

let pluginName,
  extendEslintConfig,
  scaffoldEslintConfig,
  jsPromptConstants,
  scaffoldJs,
  testForJs,
  liftJs;
const __dirname = dirname(fileURLToPath(import.meta.url));        // eslint-disable-line no-underscore-dangle
const debug = testDebug('test:common-steps');
const logger = {
  info: debug,
  success: debug,
  warn: debug,
  error: debug
};

Before(async function () {
  this.configName = any.word();
  this.projectName = `eslint-config-${this.configName}`;
  this.scope = any.word();

  nock.disableNetConnect();

  // work around for overly aggressive mock-fs, see:
  // https://github.com/tschaub/mock-fs/issues/213#issuecomment-347002795
  await import('validate-npm-package-name'); // eslint-disable-line import/no-extraneous-dependencies

  ({execa: this.execa} = (await td.replaceEsm('execa')));
  this.git = await td.replaceEsm('simple-git');

  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  const configExtender = await import('@form8ion/eslint-config-extender');
  const jsPlugin = await import('@form8ion/javascript');
  extendEslintConfig = configExtender.extendEslintConfig;
  scaffoldEslintConfig = configExtender.scaffold;
  pluginName = configExtender.PLUGIN_NAME;
  jsPromptConstants = jsPlugin.promptConstants;
  ({scaffold: scaffoldJs, test: testForJs, lift: liftJs} = jsPlugin);

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
  const {packageManagers} = await import('@form8ion/javascript-core');
  const {questionNames: jsQuestionNamesByPromptId, ids: jsPromptIds} = jsPromptConstants;
  const {questionNames: projectQuestionNamesByPromptId, ids: projectPromptIds} = promptConstants;

  const vcsHostChoice = any.word();
  const visibility = any.fromList(['OSS', 'ISS', 'CS']);
  const {scope} = this;

  const error = new Error('Command failed with exit code 1: npm ls husky --json');
  error.exitCode = 1;
  error.stdout = JSON.stringify({});
  error.command = 'npm ls husky --json';

  td.when(this.execa('npm', ['ls', 'husky', '--json'])).thenReject(error);

  const prompt = ({id}) => {
    switch (id) {
      case projectPromptIds.BASE_DETAILS: {
        const {
          PROJECT_NAME, LICENSE, VISIBILITY, DESCRIPTION, COPYRIGHT_HOLDER, COPYRIGHT_YEAR, UNLICENSED
        } = projectQuestionNamesByPromptId[projectPromptIds.BASE_DETAILS];

        return {
          [PROJECT_NAME]: this.projectName,
          [DESCRIPTION]: any.sentence(),
          [VISIBILITY]: visibility,
          ...'OSS' === visibility && {
            [LICENSE]: 'MIT',
            [COPYRIGHT_HOLDER]: any.word(),
            [COPYRIGHT_YEAR]: 2000
          },
          ...['ISS', 'CS'].includes(visibility) && {[UNLICENSED]: true}
        };
      }
      case projectPromptIds.GIT_REPOSITORY:
        return {[projectQuestionNamesByPromptId[projectPromptIds.GIT_REPOSITORY].GIT_REPO]: true};
      case projectPromptIds.REPOSITORY_HOST:
        return {[projectQuestionNamesByPromptId[projectPromptIds.REPOSITORY_HOST].REPO_HOST]: vcsHostChoice};
      case jsPromptIds.JAVASCRIPT_BASE_DETAILS: {
        const {
          NODE_VERSION_CATEGORY, AUTHOR_NAME, AUTHOR_EMAIL, AUTHOR_URL, PACKAGE_MANAGER, SCOPE, PROVIDE_EXAMPLE
        } = jsQuestionNamesByPromptId[jsPromptIds.JAVASCRIPT_BASE_DETAILS];

        return {
          [NODE_VERSION_CATEGORY]: 'LTS',
          [AUTHOR_NAME]: any.word(),
          [AUTHOR_EMAIL]: any.email(),
          [AUTHOR_URL]: any.url(),
          [PACKAGE_MANAGER]: packageManagers.NPM,
          [SCOPE]: scope,
          [PROVIDE_EXAMPLE]: false
        };
      }
      default:
        throw new Error(`Unknown prompt: ${id}`);
    }
  };

  try {
    await extendEslintConfig(
      {
        plugins: {
          vcsHosts: {
            [vcsHostChoice]: {
              scaffold: ({projectName}) => ({
                vcs: {name: projectName, host: any.url(), owner: any.word(), ssh_url: any.url()}
              })
            }
          }
        }
      },
      dependencies => ({
        scaffold: options => scaffoldJs({
          ...options,
          plugins: {
            unitTestFrameworks: {},
            packageTypes: {[pluginName]: {scaffold: scaffoldEslintConfig}}
          },
          configs: {eslint: {scope: `@${any.word()}`}}
        }, dependencies),
        lift: options => liftJs(options, dependencies),
        test: options => testForJs(options, dependencies)
      }),
      {prompt, logger}
    );
  } catch (e) {
    debug(e);
    throw e;
  }
});
