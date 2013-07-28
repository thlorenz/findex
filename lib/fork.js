'use strict';

var cp = require('child_process');
var forkScript = require.resolve('./fork-script');
var find = require('./find');

/**
 * Same as findex, except that it forks a child process to do the work (AST parsing can take time).
 * Arguments it expects are exactly the same as findex does.
 *
 * Use this findex alternative if you evaluate lots of files (in larger projects)
 * and the AST parsing is blocking your main process too much.
 *
 * @name exports
 * @function
 * @param opts
 * @param cb
 */
var go = module.exports = function (opts, cb) {
  var worker = cp.fork(forkScript, { silent: !opts.debug });

  function handleMessage (msg) {
    worker.kill();
    var err = msg.err;
    var indexes = msg.indexes;
    if (err) return cb(err);

    // the find method is not passed in the message
    indexes.find = find.bind(indexes);
    cb(null, indexes);
  }

  process.on('exit', function () {
    worker.kill();
  });

  worker
    .on('message', handleMessage)
    .send(opts);
};
