import {EOL} from 'os';
import {promises as fs} from 'fs';
import {Then} from '@cucumber/cucumber';
import {assert} from 'chai';
import {load} from 'js-yaml';

Then('the proper form8ion config is extended', async function () {
  const [index, configContents, example] = await Promise.all([
    fs.readFile(`${process.cwd()}/index.js`, 'utf-8'),
    fs.readFile(`${process.cwd()}/.eslintrc.yml`, 'utf-8'),
    fs.readFile(`${process.cwd()}/example.js`, 'utf-8')
  ]);
  const config = load(configContents);

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
