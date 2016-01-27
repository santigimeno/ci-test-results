'use strict';
const tap = require('tap');

const config = require('./config');
const ciTestResults = require('./');

tap.test('happy path', function (t) {
    // TODO: replace with fixtures rather than actually hitting the CI server
    ciTestResults.getFailingJobs({jobType: 'node-test-pull-request', jobNumber: 1372}, config, function (err) {
        t.ok(err === null, `${err} !== null`);
        t.end();
    });
});
