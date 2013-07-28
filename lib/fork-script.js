'use strict';
var find = require('..');

// the worker for 'fork.js'
process.on('message', function (opts) {
  find(opts, function (err, indexes) {
    process.send({ err: err, indexes: indexes });
  });
});
