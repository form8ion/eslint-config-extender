import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot, scope, projectName}) {
  await writeYaml(`${projectRoot}/.eslintrc.yml`, {root: true, extends: [`@${scope}`, '.']});

  return {
    scripts: {'lint:js': 'eslint .'},
    dependencies: [`@form8ion/${projectName}`],
    devDependencies: [`@${scope}/eslint-config`],
    nextSteps: [{summary: 'Save the extended `@form8ion` eslint-config as an exact version'}]
  };
}
