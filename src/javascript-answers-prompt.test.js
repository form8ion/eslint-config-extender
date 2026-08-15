import {promptConstants as jsPromptConstants} from '@form8ion/javascript';
import {dialects} from '@form8ion/javascript-core';

import {describe, it, vi, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import injectJavascriptAnswersIntoPrompt from './javascript-answers-prompt.js';
import {PLUGIN_NAME} from './constants.js';

const {
  [jsPromptConstants.ids.BASE_DETAILS]: baseDetailsQuestionNames,
  [jsPromptConstants.ids.PROJECT_TYPE_PLUGIN]: projectTypePluginQuestionNames
} = jsPromptConstants.questionNames;

describe('javascript answers prompt', () => {
  it('should call the provided prompt handler for other prompts', async () => {
    const promptDetails = {...any.simpleObject(), id: any.word()};
    const prompt = vi.fn();
    const answers = any.simpleObject();
    when(prompt).calledWith(promptDetails).thenResolve(answers);

    expect(await injectJavascriptAnswersIntoPrompt(prompt)(promptDetails)).toEqual(answers);
  });

  it('should force the base-details answers required for an eslint-config package, deferring the rest', async () => {
    const otherQuestion = {name: any.word(), ...any.simpleObject()};
    const questions = [
      {name: baseDetailsQuestionNames.PROJECT_TYPE, ...any.simpleObject()},
      {name: baseDetailsQuestionNames.UNIT_TESTS, ...any.simpleObject()},
      {name: baseDetailsQuestionNames.INTEGRATION_TESTS, ...any.simpleObject()},
      {name: baseDetailsQuestionNames.CONFIGURE_LINTING, ...any.simpleObject()},
      {name: baseDetailsQuestionNames.DIALECT, ...any.simpleObject()},
      {name: baseDetailsQuestionNames.SHOULD_BE_SCOPED, ...any.simpleObject()},
      otherQuestion
    ];
    const promptDetails = {id: jsPromptConstants.ids.BASE_DETAILS, questions};
    const prompt = vi.fn();
    const answersFromCaller = any.simpleObject();
    when(prompt).calledWith({...promptDetails, questions: [otherQuestion]}).thenResolve(answersFromCaller);

    expect(await injectJavascriptAnswersIntoPrompt(prompt)(promptDetails)).toEqual({
      ...answersFromCaller,
      [baseDetailsQuestionNames.PROJECT_TYPE]: 'Package',
      [baseDetailsQuestionNames.UNIT_TESTS]: false,
      [baseDetailsQuestionNames.INTEGRATION_TESTS]: false,
      [baseDetailsQuestionNames.CONFIGURE_LINTING]: false,
      [baseDetailsQuestionNames.DIALECT]: dialects.COMMON_JS,
      [baseDetailsQuestionNames.SHOULD_BE_SCOPED]: true
    });
  });

  it('should choose the eslint-config plugin for the project-type-plugin prompt', async () => {
    const promptDetails = {id: jsPromptConstants.ids.PROJECT_TYPE_PLUGIN, questions: any.listOf(any.simpleObject)};

    expect(await injectJavascriptAnswersIntoPrompt(() => undefined)(promptDetails)).toEqual({
      [projectTypePluginQuestionNames.PROJECT_TYPE_CHOICE]: PLUGIN_NAME
    });
  });
});
