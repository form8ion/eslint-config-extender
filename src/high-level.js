import deepmerge from 'deepmerge';
import {questionNames as jsQuestionNames} from '@travi/javascript-scaffolder';
import {scaffold, questionNames as projectQuestionNames} from '@form8ion/project';
import {PLUGIN_NAME} from './constants';

export default function (options, javascriptScaffolderFactory) {
  const javaScriptLanguageChoice = 'JavaScript';

  return scaffold(
    deepmerge(
      options,
      {
        decisions: {[projectQuestionNames.PROJECT_LANGUAGE]: javaScriptLanguageChoice},
        languages: {
          [javaScriptLanguageChoice]: javascriptScaffolderFactory({
            ...options.decisions,
            [jsQuestionNames.PROJECT_TYPE]: 'Package',
            [jsQuestionNames.PROJECT_TYPE_CHOICE]: PLUGIN_NAME,
            [jsQuestionNames.UNIT_TESTS]: false,
            [jsQuestionNames.INTEGRATION_TESTS]: false,
            [jsQuestionNames.TRANSPILE_LINT]: false
          })
        }
      }
    )
  );
}
