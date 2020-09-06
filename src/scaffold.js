export default function ({scope}) {
  return {
    scripts: {'lint:js': 'eslint .'},
    devDependencies: [`@${scope}/eslint-config`]
  };
}
