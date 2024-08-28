import {promises as fs} from 'node:fs';
import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

export default async function ({projectRoot, scope, projectName}) {
  const configShortName = projectName.substring('eslint-config-'.length);

  await Promise.all([
    write({
      format: fileTypes.YAML,
      path: projectRoot,
      name: 'eslint',
      config: {root: true, extends: [`@${scope}`, '.']}
    }),
    fs.writeFile(
      `${projectRoot}/index.js`,
      `module.exports = {extends: '@form8ion/${configShortName}'};\n`
    ),
    fs.writeFile(
      `${projectRoot}/example.js`,
      `module.exports = {
  extends: [
    '@${scope}',
    '@${scope}/${configShortName}'
  ]
};
`
    )
  ]);

  return {
    scripts: {'lint:js': 'eslint .'},
    dependencies: [`@form8ion/${projectName}`],
    devDependencies: [`@${scope}/eslint-config`],
    nextSteps: [
      {summary: 'Save the extended `@form8ion` eslint-config as an exact version'},
      {summary: 'Document saving this config using the dev flag'},
      {summary: 'Link to the extended `@form8ion` config in the README'}
    ]
  };
}
