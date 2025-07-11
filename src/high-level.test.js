import * as projectScaffolder from '@form8ion/project';
import * as javascriptScaffolder from '@form8ion/javascript';
import {dialects} from '@form8ion/javascript-core';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {PLUGIN_NAME} from './constants.js';
import extendEslintConfig from './high-level.js';

describe('high-level scaffolder', () => {
  beforeEach(() => {
    vi.mock('@form8ion/project');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should execute the project-scaffolder', async () => {
    const providedDecisions = any.simpleObject();
    const options = {...any.simpleObject(), decisions: providedDecisions};
    const jsPlugin = {scaffold: any.simpleObject()};
    const javascriptPluginFactory = vi.fn();
    when(javascriptPluginFactory).calledWith({
      ...providedDecisions,
      [javascriptScaffolder.questionNames.PROJECT_TYPE]: 'Package',
      [javascriptScaffolder.questionNames.PROJECT_TYPE_CHOICE]: PLUGIN_NAME,
      [javascriptScaffolder.questionNames.UNIT_TESTS]: false,
      [javascriptScaffolder.questionNames.INTEGRATION_TESTS]: false,
      [javascriptScaffolder.questionNames.CONFIGURE_LINTING]: false,
      [javascriptScaffolder.questionNames.DIALECT]: dialects.COMMON_JS,
      [javascriptScaffolder.questionNames.SHOULD_BE_SCOPED]: true
    }).thenReturn(jsPlugin);

    await extendEslintConfig(options, javascriptPluginFactory);

    expect(projectScaffolder.scaffold).toHaveBeenCalledWith({
      ...options,
      decisions: {...providedDecisions, [projectScaffolder.questionNames.PROJECT_LANGUAGE]: 'JavaScript'},
      plugins: {languages: {JavaScript: jsPlugin}}
    });
  });
});
