'use strict';

const async = require('async');
const request = require('request');
const JSONStream = require('JSONStream');

const BASE_URL = 'https://ci.nodejs.org';

const failing = [];

function parseJob(url, cb) {
    const _url = [ url, 'api', 'json' ].join('/');
    const parse = JSONStream.parse();
    parse.on('data', function(data) {
        if (data.result === 'SUCCESS') {
            return cb();
        }

        parse2(data.subBuilds || data.runs || data.url, cb);
    });

    request(_url).pipe(parse);
}

function parse2(builds, cb) {
    // If string is the URL of the failing JOB
    if (typeof builds === 'string') {
        failing.push(builds);
        return cb();
    }

    async.each(
        builds,
        function(build, cb) {
            if (build.result === 'SUCCESS') {
                return cb();
            }

            let url;
            if (build.url.indexOf('https') === 0) {
                url = build.url;
            } else {
                url = [ BASE_URL, build.url ].join('/');
            }

            parseJob(url, cb);
        },
        cb
    );
}

function getTapResults(jobUrl, cb) {
    const results = [];
    const url = [ jobUrl, 'consoleText' ].join('/');
    var req = request(url);
    req.on('response', function(resp) {
        if (resp.statusCode !== 200) {
            return cb(null, []);
        }

        let currentError;
        const tapParser = require('tap-parser')();
        tapParser.on('assert', function(assert) {
            if (!assert.ok && assert.diag) {
                currentError = assert;
                currentError.comments = '';
                results.push(currentError);
            }
        });

        tapParser.on('comment', function(comment) {
            if (currentError) {
                currentError.comments += comment;
            }
        });

        tapParser.on('complete', function() {
            cb(null, results);
        });

        req.pipe(tapParser);
    });

    req.on('error', function(err) {
        console.log(err);
        console.log(err.stack);
        cb();
    });
}

exports.getFailingJobs = function (options, config, done) {
    // TODO: return data object and let CLI handle output
    const URL = config.url || [ BASE_URL, 'job', options.jobType, options.jobNumber ].join('/');

    parseJob(URL, function() {
        console.log('Failing jobs');
        console.log(failing);
        async.each(
            failing,
            function(url, cb) {
                getTapResults(url, function(err, res) {
                    if (err) {
                        return cb(err);
                    }
                    if (res.length > 0) {
                        console.log('');
                        console.log('Failing tests @ ' + url);
                        res.forEach(function(test, i) {
                            console.log('');
                            console.log((i + 1) + ') ' + test.name);
                            console.log('----------------------------------------------');
                            console.log(test.comments);
                        });

                        console.log('==============================================');
                    }
                    cb();
                });
            },
            done
        );
    });
};
