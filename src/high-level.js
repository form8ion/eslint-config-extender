import deepmerge from 'deepmerge';
import {questionNames as jsQuestionNames} from '@form8ion/javascript';
import {dialects} from '@form8ion/javascript-core';
import {questionNames as projectQuestionNames, scaffold} from '@form8ion/project';

import {PLUGIN_NAME} from './constants.js';

export default function (options, javascriptScaffolderFactory) {
  const javaScriptLanguageChoice = 'JavaScript';

  return scaffold(
    deepmerge(
      options,
      {
        decisions: {[projectQuestionNames.PROJECT_LANGUAGE]: javaScriptLanguageChoice},
        plugins: {
          languages: {
            [javaScriptLanguageChoice]: {
              scaffold: javascriptScaffolderFactory({
                ...options.decisions,
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
      }
    )
  );
}
