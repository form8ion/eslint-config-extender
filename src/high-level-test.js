import * as projectScaffolder from '@travi/project-scaffolder';
import * as javascriptScaffolder from '@travi/javascript-scaffolder';
import sinon from 'sinon';
import {assert} from 'chai';
import any from '@travi/any';
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
        [javascriptScaffolder.questionNames.PROJECT_TYPE]: 'Package',
        unitTests: false,
        integrationTests: false,
        [javascriptScaffolder.questionNames.TRANSPILE_LINT]: false
      })
      .returns(jsScaffolder);

    await extendEslintConfig(options, javascriptScaffolderFactory);

    assert.calledWith(
      projectScaffolder.scaffold,
      {
        ...options,
        decisions: {...providedDecisions, [projectScaffolder.questionNames.PROJECT_TYPE]: 'JavaScript'},
        languages: {JavaScript: jsScaffolder}
      }
    );
  });
});
