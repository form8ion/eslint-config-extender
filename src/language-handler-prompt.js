import {promptConstants, questionNames as projectQuestionNames} from '@form8ion/project';
import {JAVASCRIPT_LANGUAGE_CHOICE} from './constants.js';

export default function injectLanguageChoiceIntoPrompt(prompt) {
  return promptOptions => {
    const {id} = promptOptions;

    if (promptConstants.ids.PROJECT_LANGUAGE === id) {
      return {[projectQuestionNames.PROJECT_LANGUAGE]: JAVASCRIPT_LANGUAGE_CHOICE};
    }
    return prompt(promptOptions);
  };
}
