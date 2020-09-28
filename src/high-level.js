import deepmerge from 'deepmerge';
import {scaffold, questionNames as projectQuestionNames} from '@travi/project-scaffolder';
import {questionNames as jsQuestionNames} from '@travi/javascript-scaffolder';

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
            unitTests: false,
            integrationTests: false,
            [jsQuestionNames.TRANSPILE_LINT]: false
          })
        }
      }
    )
  );
}
