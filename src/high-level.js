import deepmerge from 'deepmerge';
import {scaffold} from '@form8ion/project';

import {JAVASCRIPT_LANGUAGE_CHOICE} from './constants.js';
import injectLanguageChoiceIntoPrompt from './language-handler-prompt.js';
import injectJavascriptAnswersIntoPrompt from './javascript-answers-prompt.js';

export default function extendEslintConfig(options, javascriptPluginFactory, dependencies) {
  return scaffold(
    deepmerge(
      options,
      {
        plugins: {
          languages: {
            [JAVASCRIPT_LANGUAGE_CHOICE]: javascriptPluginFactory({
              ...dependencies,
              prompt: injectJavascriptAnswersIntoPrompt(dependencies.prompt)
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
