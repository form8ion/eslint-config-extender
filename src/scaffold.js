import writeYaml from '../thirdparty-wrappers/write-yaml';

export default async function ({projectRoot, scope}) {
  // install form8ion config of the same context as a prod dependency (save-exact) (needs chosen context)
  // write .eslintrc.yml (needs scope)
  // write index to extend form8ion config of the same context (needs chosen context)

  await writeYaml(
    `${projectRoot}/.eslintrc.yml`,
    {
      root: true,
      extends: [`@${scope}`, '.']
    }
  );

  return {
    scripts: {'lint:js': 'eslint .'},
    devDependencies: [`@${scope}/eslint-config`]
  };
}
