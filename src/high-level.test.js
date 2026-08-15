import * as projectScaffolder from '@form8ion/project';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import {JAVASCRIPT_LANGUAGE_CHOICE} from './constants.js';
import injectLanguageChoiceIntoPrompt from './language-handler-prompt.js';
import injectJavascriptAnswersIntoPrompt from './javascript-answers-prompt.js';
import extendEslintConfig from './high-level.js';

vi.mock('@form8ion/project');
vi.mock('./language-handler-prompt.js');
vi.mock('./javascript-answers-prompt.js');

describe('high-level scaffolder', () => {
  it('should execute the project-scaffolder', async () => {
    const prompt = () => undefined;
    const enhancedPrompt = () => undefined;
    const javascriptPrompt = () => undefined;
    const dependencies = {...any.simpleObject(), prompt};
    const options = any.simpleObject();
    const jsPlugin = {scaffold: any.simpleObject()};
    const javascriptPluginFactory = vi.fn();
    when(injectJavascriptAnswersIntoPrompt).calledWith(prompt).thenReturn(javascriptPrompt);
    when(javascriptPluginFactory).calledWith({...dependencies, prompt: javascriptPrompt}).thenReturn(jsPlugin);
    when(injectLanguageChoiceIntoPrompt).calledWith(prompt).thenReturn(enhancedPrompt);

    await extendEslintConfig(options, javascriptPluginFactory, dependencies);

    expect(projectScaffolder.scaffold).toHaveBeenCalledWith(
      {
        ...options,
        plugins: {languages: {[JAVASCRIPT_LANGUAGE_CHOICE]: jsPlugin}}
      },
      {...dependencies, prompt: enhancedPrompt}
    );
  });
});
