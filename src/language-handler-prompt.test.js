import {promptConstants} from '@form8ion/project';

import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import injectLanguageChoiceIntoPrompt from './language-handler-prompt.js';
import {JAVASCRIPT_LANGUAGE_CHOICE} from './constants.js';

describe('language choice handler prompt', () => {
  it('should call the provided prompt handler for other prompts', async () => {
    const promptOptions = {...any.simpleObject(), id: any.word()};
    const prompt = vi.fn();
    const answers = any.simpleObject();
    when(prompt).calledWith(promptOptions).thenResolve(answers);

    expect(await injectLanguageChoiceIntoPrompt(prompt)(promptOptions)).toEqual(answers);
  });

  it('should define the language choice as JavaScript for the language handler prompt', async () => {
    const projectLanguagePromptId = promptConstants.ids.PROJECT_LANGUAGE;

    expect(await injectLanguageChoiceIntoPrompt(() => undefined)({...any.simpleObject(), id: projectLanguagePromptId}))
      .toEqual({[promptConstants.questionNames[projectLanguagePromptId].PROJECT_LANGUAGE]: JAVASCRIPT_LANGUAGE_CHOICE});
  });
});
