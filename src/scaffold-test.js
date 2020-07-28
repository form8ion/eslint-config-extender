import {assert} from 'chai';
import scaffold from './scaffold';

suite('scaffold', () => {
  test('that the chosen form8ion config is extended', async () => {
    const {scripts} = await scaffold();

    assert.deepEqual(scripts, {'lint:js': 'eslint .'});
  });
});
