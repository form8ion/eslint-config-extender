import {promptConstants} from '@form8ion/project';
import {JAVASCRIPT_LANGUAGE_CHOICE} from './constants.js';

export default function injectLanguageChoiceIntoPrompt(prompt) {
  return promptOptions => {
    const {id} = promptOptions;
    const projectLanguagePromptId = promptConstants.ids.PROJECT_LANGUAGE;

    if (projectLanguagePromptId === id) {
      return {[promptConstants.questionNames[projectLanguagePromptId].PROJECT_LANGUAGE]: JAVASCRIPT_LANGUAGE_CHOICE};
    }
    return prompt(promptOptions);
  };
}
