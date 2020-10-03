import {EOL} from 'os';
import {promises as fs} from 'fs';
import {Then} from 'cucumber';
import {assert} from 'chai';
import {safeLoad} from 'js-yaml';

Then('the proper form8ion config is extended', async function () {
  const [indexBuffer, configBuffer] = await Promise.all([
    fs.readFile(`${process.cwd()}/index.js`),
    fs.readFile(`${process.cwd()}/.eslintrc.yml`)
  ]);
  const config = safeLoad(configBuffer.toString());
  const index = indexBuffer.toString();

  assert.equal(index, `module.exports = {extends: '@form8ion/${this.configName}'};${EOL}`);
  assert.deepEqual(config.extends, [`@${this.scope}`, '.']);
});
