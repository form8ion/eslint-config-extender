import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import * as writeYaml from '../thirdparty-wrappers/write-yaml';
import scaffold from './scaffold';

suite('scaffold', () => {
  let sandbox;
  const projectRoot = any.string();

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(writeYaml, 'default');
  });

  teardown(() => sandbox.restore());

  test('that the chosen form8ion config is extended', async () => {
    const scope = any.word();
    writeYaml.default.resolves();

    const {scripts, devDependencies} = await scaffold({projectRoot, scope});

    assert.calledWith(
      writeYaml.default,
      `${projectRoot}/.eslintrc.yml`,
      {
        root: true,
        extends: [`@${scope}`, '.']
      }
    );
    assert.deepEqual(scripts, {'lint:js': 'eslint .'});
    assert.deepEqual(devDependencies, [`@${scope}/eslint-config`]);
  });
});
