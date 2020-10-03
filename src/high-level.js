import deepmerge from 'deepmerge';
import {scaffold, questionNames as projectQuestionNames} from '@travi/project-scaffolder';
import {questionNames as jsQuestionNames} from '@travi/javascript-scaffolder';
import {PLUGIN_NAME} from './constants';

export default function (options, javascriptScaffolderFactory) {
  const javaScriptLanguageChoice = 'JavaScript';

  return scaffold(
    deepmerge(
      options,
      {
        decisions: {[projectQuestionNames.PROJECT_TYPE]: javaScriptLanguageChoice},
        languages: {
          [javaScriptLanguageChoice]: javascriptScaffolderFactory({
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
