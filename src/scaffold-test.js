import {assert} from 'chai';
import any from '@travi/any';
import scaffold from './scaffold';

suite('scaffold', () => {
  test('that the chosen form8ion config is extended', async () => {
    const scope = any.word();

    const {scripts, devDependencies} = await scaffold({scope});

    assert.deepEqual(scripts, {'lint:js': 'eslint .'});
    assert.deepEqual(devDependencies, [`@${scope}/eslint-config`]);
  });
});
