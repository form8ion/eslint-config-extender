import deepmerge from 'deepmerge';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {dialects} from '@form8ion/javascript-core';
import {scaffold} from '@form8ion/project';

import {JAVASCRIPT_LANGUAGE_CHOICE, PLUGIN_NAME} from './constants.js';
import injectLanguageChoiceIntoPrompt from './language-handler-prompt.js';

export default function extendEslintConfig(options, javascriptPluginFactory, dependencies) {
  const {decisions, ...otherOptions} = options;

  return scaffold(
    deepmerge(
      otherOptions,
      {
        plugins: {
          languages: {
            [JAVASCRIPT_LANGUAGE_CHOICE]: javascriptPluginFactory({
              ...decisions,
              [jsQuestionNames.PROJECT_TYPE]: 'Package',
              [jsQuestionNames.PROJECT_TYPE_CHOICE]: PLUGIN_NAME,
              [jsQuestionNames.UNIT_TESTS]: false,
              [jsQuestionNames.INTEGRATION_TESTS]: false,
              [jsQuestionNames.CONFIGURE_LINTING]: false,
              [jsQuestionNames.DIALECT]: dialects.COMMON_JS,
              [jsQuestionNames.SHOULD_BE_SCOPED]: true
            })
          }
        }
      }
    ),
    {
      ...dependencies,
      prompt: injectLanguageChoiceIntoPrompt(dependencies.prompt)
    }
  );
}
