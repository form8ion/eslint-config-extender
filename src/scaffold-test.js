import {promises as fs} from 'fs';
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
    sandbox.stub(fs, 'writeFile');
  });

  teardown(() => sandbox.restore());

  test('that the chosen form8ion config is extended', async () => {
    const scope = any.word();
    const configShortName = any.word();
    const projectName = `eslint-config-${configShortName}`;
    writeYaml.default.resolves();
    fs.writeFile.resolves();

    const {scripts, dependencies, devDependencies, nextSteps} = await scaffold({projectRoot, projectName, scope});

    assert.calledWith(writeYaml.default, `${projectRoot}/.eslintrc.yml`, {root: true, extends: [`@${scope}`, '.']});
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/index.js`,
      `module.exports = {extends: '@form8ion/${configShortName}'};\n`
    );
    assert.calledWith(
      fs.writeFile,
      `${projectRoot}/example.js`,
      `module.exports = {
  extends: [
    '@${scope}',
    '@${scope}/${configShortName}'
  ]
};
`
    );
    assert.deepEqual(scripts, {'lint:js': 'eslint .'});
    assert.deepEqual(dependencies, [`@form8ion/${projectName}`]);
    assert.deepEqual(devDependencies, [`@${scope}/eslint-config`]);
    assert.deepEqual(
      nextSteps,
      [
        {summary: 'Save the extended `@form8ion` eslint-config as an exact version'},
        {summary: 'Document saving this config using the dev flag'},
        {summary: 'Link to the extended `@form8ion` config in the README'}
      ]
    );
  });
});
