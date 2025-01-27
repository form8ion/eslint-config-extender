import {promises as fs} from 'node:fs';
import {fileTypes} from '@form8ion/core';
import {write} from '@form8ion/config-file';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';

import scaffold from './scaffold.js';

describe('scaffold', () => {
  const projectRoot = any.string();

  beforeEach(() => {
    vi.mock('node:fs');
    vi.mock('@form8ion/config-file');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should extend the chosen form8ion config', async () => {
    const scope = any.word();
    const configShortName = any.word();
    const projectName = `eslint-config-${configShortName}`;

    const {scripts, dependencies, nextSteps} = await scaffold({projectRoot, projectName, scope});

    expect(write).toHaveBeenCalledWith({
      path: projectRoot,
      format: fileTypes.YAML,
      name: 'eslint',
      config: {root: true, extends: [`@${scope}`, '.']}
    });
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/index.js`,
      `module.exports = {extends: '@form8ion/${configShortName}'};\n`
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      `${projectRoot}/example.js`,
      `module.exports = {
  extends: [
    '@${scope}',
    '@${scope}/${configShortName}'
  ]
};
`
    );
    expect(scripts).toEqual({'lint:js': 'eslint .'});
    expect(dependencies.javascript.production).toEqual([`@form8ion/${projectName}`]);
    expect(dependencies.javascript.development).toEqual([`@${scope}/eslint-config`]);
    expect(nextSteps).toEqual([
      {summary: 'Save the extended `@form8ion` eslint-config as an exact version'},
      {summary: 'Document saving this config using the dev flag'},
      {summary: 'Link to the extended `@form8ion` config in the README'}
    ]);
  });
});
