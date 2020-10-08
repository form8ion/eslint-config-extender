import {Given} from 'cucumber';
import td from 'testdouble';
import any from '@travi/any';

Given(/^the npm cli is logged in$/, function () {
  this.npmAccount = any.word();

  td.when(this.shell.exec('npm run generate:md && npm test', {silent: false})).thenCallback(0);
  td.when(this.execa('npm', ['whoami'])).thenResolve({stdout: this.npmAccount});
});
