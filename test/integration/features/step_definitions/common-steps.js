// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import {extendEslintConfig} from '@form8ion/eslint-config-extender';
import {When} from 'cucumber';

When('the high-level scaffolder is executed', async function () {
  await extendEslintConfig();
});
