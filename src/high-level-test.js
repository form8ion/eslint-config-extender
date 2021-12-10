import * as javascriptScaffolder from '@form8ion/javascript';
import * as projectScaffolder from '@form8ion/project';
import {dialects} from '@form8ion/javascript-core';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
import {PLUGIN_NAME} from './constants';
import extendEslintConfig from './high-level';

suite('high-level scaffolder', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(projectScaffolder, 'scaffold');
  });

  teardown(() => sandbox.restore());

  test('that the project-scaffolder is executed', async () => {
    const providedDecisions = any.simpleObject();
    const options = {...any.simpleObject(), decisions: providedDecisions};
    const javascriptScaffolderFactory = sinon.stub();
    const jsScaffolder = any.simpleObject();
    javascriptScaffolderFactory
      .withArgs({
        ...providedDecisions,
        [javascriptScaffolder.questionNames.PROJECT_TYPE]: 'Package',
        [javascriptScaffolder.questionNames.PROJECT_TYPE_CHOICE]: PLUGIN_NAME,
        [javascriptScaffolder.questionNames.UNIT_TESTS]: false,
        [javascriptScaffolder.questionNames.INTEGRATION_TESTS]: false,
        [javascriptScaffolder.questionNames.CONFIGURE_LINTING]: false,
        [javascriptScaffolder.questionNames.DIALECT]: dialects.COMMON_JS,
        [javascriptScaffolder.questionNames.SHOULD_BE_SCOPED]: true
      })
      .returns(jsScaffolder);

    await extendEslintConfig(options, javascriptScaffolderFactory);

    assert.calledWith(
      projectScaffolder.scaffold,
      {
        ...options,
        decisions: {...providedDecisions, [projectScaffolder.questionNames.PROJECT_LANGUAGE]: 'JavaScript'},
        languages: {JavaScript: jsScaffolder}
      }
    );
  });
});
