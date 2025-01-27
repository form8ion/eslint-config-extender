import {Given} from '@cucumber/cucumber';
import * as td from 'testdouble';
import any from '@travi/any';

Given(/^the npm cli is logged in$/, function () {
  this.npmAccount = any.word();

  td.when(this.execa('npm run generate:md && npm test', {shell: true})).thenReturn({stdout: {pipe: () => undefined}});
  td.when(this.execa('npm', ['whoami'])).thenResolve({stdout: this.npmAccount});
  td.when(this.execa('npm', ['--version'])).thenResolve({stdout: any.word()});
});
