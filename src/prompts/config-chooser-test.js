import * as overridablePrompts from '@form8ion/overridable-prompts';
import sinon from 'sinon';
import any from '@travi/any';
import {assert} from 'chai';
import {questionNames} from './question-names';
import chooseConfigToExtend from './config-chooser';

suite('chooseConfigToExtend', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(overridablePrompts, 'prompt');
  });

  teardown(() => sandbox.restore());

  test('that the form8ion config to extend is chosen', async () => {
    const chosenConfigName = any.word();
    const decisions = any.simpleObject();
    overridablePrompts.prompt
      .withArgs([{
        name: questionNames.CONFIG_TO_EXTEND,
        type: 'input',
        message: 'Which shareable form8ion ESLint config would you like to extend?'
      }], decisions)
      .resolves({[questionNames.CONFIG_TO_EXTEND]: chosenConfigName});

    assert.equal(await chooseConfigToExtend(decisions), chosenConfigName);
  });
});
