// #### Import
// remark-usage-ignore-next 2
import stubbedFs from 'mock-fs';
import {scaffold as javascriptScaffolder} from '@form8ion/javascript';
import {scaffold, extendEslintConfig} from './lib/index.js';

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
  await extendEslintConfig(
    {options: 'for the project-scaffolder'},
    decisions => javascriptScaffolder({options: 'for the js-scaffolder', decisions})
  );
})();
