/* eslint-disable no-console */
import path from 'path';
import fse from 'fs-extra';

const files = [
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'package.json',
];

const resolveBuildPath = file =>
  path.resolve(__dirname, '../dist/', path.basename(file));

const copyFile = file => new Promise((resolve) => {
  fse.copy(file, resolveBuildPath(file), (err) => {
    if (err) throw err;
    resolve();
  });
})


Promise.all(files.map(copyFile))
  .then(() => console.log('Success'))
  .catch(console.error);
