import {Before, Given} from '@cucumber/cucumber';
import * as td from 'testdouble';

import {GitError} from 'simple-git';

const simpleGitInstance = td.object(['checkIsRepo', 'listRemote', 'remote', 'addRemote', 'init']);

Before(function () {
  td.when(this.git.simpleGit({baseDir: process.cwd()})).thenReturn(simpleGitInstance);
});

Given('the project should be versioned in git', async function () {
  td.when(simpleGitInstance.checkIsRepo('root')).thenResolve(false, true);
  td.when(simpleGitInstance.listRemote())
    .thenReject(new GitError(null, 'fatal: No remote configured to list refs from.\n'));
});
