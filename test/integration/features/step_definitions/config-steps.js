import {EOL} from 'os';
import {promises as fs} from 'fs';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {load} from 'js-yaml';

Then('the proper form8ion config is extended', async function () {
  const [indexBuffer, configBuffer, exampleBuffer] = await Promise.all([
    fs.readFile(`${process.cwd()}/index.js`),
    fs.readFile(`${process.cwd()}/.eslintrc.yml`),
    fs.readFile(`${process.cwd()}/example.js`)
  ]);
  const config = load(configBuffer.toString());
  const index = indexBuffer.toString();
  const example = exampleBuffer.toString();

  assert.equal(index, `module.exports = {extends: '@form8ion/${this.configName}'};${EOL}`);
  assert.deepEqual(config.extends, [`@${this.scope}`, '.']);
  assert.equal(
    example,
    `module.exports = {
  extends: [
    '@${this.scope}',
    '@${this.scope}/${this.configName}'
  ]
};
`
  );
});
