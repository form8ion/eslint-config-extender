import {promises as fs} from 'fs';
import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot, scope, projectName}) {
  await Promise.all([
    writeYaml(`${projectRoot}/.eslintrc.yml`, {root: true, extends: [`@${scope}`, '.']}),
    fs.writeFile(
      `${projectRoot}/index.js`,
      `module.exports = {extends: '@form8ion/${projectName.substring('eslint-config-'.length)}'};`
    )
  ]);

  return {
    scripts: {'lint:js': 'eslint .'},
    dependencies: [`@form8ion/${projectName}`],
    devDependencies: [`@${scope}/eslint-config`],
    nextSteps: [
      {summary: 'Save the extended `@form8ion` eslint-config as an exact version'},
      {summary: 'Document saving this config using the dev flag'},
      {summary: 'Replace the code example in the README with a config example'},
      {summary: 'Link to the extended `@form8ion` config in the README'}
    ]
  };
}
