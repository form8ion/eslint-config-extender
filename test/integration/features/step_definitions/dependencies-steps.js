import {DEV_DEPENDENCY_TYPE, PROD_DEPENDENCY_TYPE} from '@form8ion/javascript-core';

import * as td from 'testdouble';
import {Then} from '@cucumber/cucumber';

function escapeSpecialCharacters(string) {
  return string.replace(/[.*+?^$\-{}()|[\]\\]/g, '\\$&');
}

function assertDevDependencyIsInstalled(execa, dependencyName) {
  td.verify(
    execa(td.matchers.contains(
      new RegExp(`(npm install|yarn add).*${escapeSpecialCharacters(dependencyName)}.*${DEV_DEPENDENCY_TYPE}`)
    )),
    {ignoreExtraArgs: true}
  );
}

function assertProdDependencyIsInstalled(execa, dependencyName) {
  td.verify(
    execa(td.matchers.contains(
      new RegExp(`(npm install|yarn add).*${escapeSpecialCharacters(dependencyName)}.*${PROD_DEPENDENCY_TYPE}`)
    )),
    {ignoreExtraArgs: true}
  );
}

Then('dependencies are installed', async function () {
  assertProdDependencyIsInstalled(this.execa, `@form8ion/${this.projectName}`);
  assertDevDependencyIsInstalled(this.execa, `@${this.scope}/eslint-config`);
});
