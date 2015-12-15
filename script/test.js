#!/usr/bin/env node

/**
 * test -- Initiates the testing cycle and sets `./test/src` as the files to execute. Istanbul is used for code
 * coverage and tests are run with Mocha and results are uploaded to Codecov.io
 */

var sh = require('./sh');

var mochaOption = " --recursive ./test/src -R spec";

console.log('%% process.argv: ' +process.argv);

if (process.env.TRAVIS)
{
   sh.exec('babel-node ./node_modules/.bin/isparta cover --report lcovonly --excludes "./node_modules/mocha/bin/_mocha" --compilers js:babel-core/register _mocha -- ' + mochaOption
    + ' && cat ./coverage/lcov.info | ./node_modules/codecov.io/bin/codecov.io.js');
}
else if(process.argv.indexOf('--coverage') !== -1)
{
   sh.exec('babel-node ./node_modules/.bin/isparta cover --report lcovonly --excludes "./node_modules/mocha/bin/_mocha" --compilers js:babel-core/register _mocha -- ' + mochaOption);
}

else
{
   sh.exec('babel-node ./node_modules/.bin/mocha --compilers js:babel-core/register' + mochaOption);
}