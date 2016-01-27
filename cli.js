#!/usr/bin/env node
'use strict';
const meow = require('meow');

const config = require('./config');
const ciTestResults = require('./');

const _ = meow({
    help: config.helpMsg
}, {
    alias: {
        h: 'help',
        n: 'job-number',
        j: 'job-type'
    }
});

if (! _.flags.jobType || ! _.flags.jobNumber) {
    return _.showHelp();
}

return ciTestResults.getFailingJobs(_.flags, config, function (err) {
    if (err) {
        console.error(err);
    }
});
