import * as projectScaffolder from '@form8ion/project';
import * as javascriptScaffolder from '@form8ion/javascript';
import {dialects} from '@form8ion/javascript-core';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {JAVASCRIPT_LANGUAGE_CHOICE, PLUGIN_NAME} from './constants.js';
import injectLanguageChoiceIntoPrompt from './language-handler-prompt.js';
import extendEslintConfig from './high-level.js';

vi.mock('@form8ion/project');
vi.mock('./language-handler-prompt.js');

describe('high-level scaffolder', () => {
  it('should execute the project-scaffolder', async () => {
    const prompt = () => undefined;
    const enhancedPrompt = () => undefined;
    const dependencies = {...any.simpleObject(), prompt};
    const providedDecisions = any.simpleObject();
    const optionsWithoutDecisions = any.simpleObject();
    const options = {...optionsWithoutDecisions, decisions: providedDecisions};
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
    when(injectLanguageChoiceIntoPrompt).calledWith(prompt).thenReturn(enhancedPrompt);

    await extendEslintConfig(options, javascriptPluginFactory, dependencies);

    expect(projectScaffolder.scaffold).toHaveBeenCalledWith(
      {
        ...optionsWithoutDecisions,
        plugins: {languages: {[JAVASCRIPT_LANGUAGE_CHOICE]: jsPlugin}}
      },
      {...dependencies, prompt: enhancedPrompt}
    );
  });
});
