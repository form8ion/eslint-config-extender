// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold, extendEslintConfig} from './lib/index.cjs';

// remark-usage-ignore-next
stubbedFs();

// #### Execute

// ##### Scaffolder Plugin

(async () => {
  await scaffold({
    projectRoot: process.cwd(),
    projectName: 'eslint-config-foo',
    scope: 'bar'
  });
})();

// ##### High-Level Scaffolder

(async () => {
  await extendEslintConfig();
})();
