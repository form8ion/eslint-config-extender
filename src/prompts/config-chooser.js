import {prompt} from '@form8ion/overridable-prompts';
import {questionNames} from './question-names';

export default async function (decisions) {
  const answers = await prompt([{
    name: questionNames.CONFIG_TO_EXTEND,
    type: 'input',
    message: 'Which shareable form8ion ESLint config would you like to extend?'
  }], decisions);

  return answers[questionNames.CONFIG_TO_EXTEND];
}
