import {promptConstants as jsPromptConstants} from '@form8ion/javascript';
import {dialects} from '@form8ion/javascript-core';

import {PLUGIN_NAME} from './constants.js';

const {
  [jsPromptConstants.ids.JAVASCRIPT_BASE_DETAILS]: baseDetailsQuestionNames,
  [jsPromptConstants.ids.PROJECT_TYPE_PLUGIN]: projectTypePluginQuestionNames
} = jsPromptConstants.questionNames;

const forcedBaseDetailsAnswers = {
  [baseDetailsQuestionNames.PROJECT_TYPE]: 'Package',
  [baseDetailsQuestionNames.UNIT_TESTS]: false,
  [baseDetailsQuestionNames.INTEGRATION_TESTS]: false,
  [baseDetailsQuestionNames.CONFIGURE_LINTING]: false,
  [baseDetailsQuestionNames.DIALECT]: dialects.COMMON_JS,
  [baseDetailsQuestionNames.SHOULD_BE_SCOPED]: true
};

export default function injectJavascriptAnswersIntoPrompt(prompt) {
  return async promptDetails => {
    const {id, questions} = promptDetails;

    if (jsPromptConstants.ids.JAVASCRIPT_BASE_DETAILS === id) {
      const remainingQuestions = questions.filter(({name}) => !(name in forcedBaseDetailsAnswers));

      return {...await prompt({...promptDetails, questions: remainingQuestions}), ...forcedBaseDetailsAnswers};
    }

    if (jsPromptConstants.ids.PROJECT_TYPE_PLUGIN === id) {
      return {[projectTypePluginQuestionNames.PROJECT_TYPE_CHOICE]: PLUGIN_NAME};
    }

    return prompt(promptDetails);
  };
}
