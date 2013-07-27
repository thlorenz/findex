'use strict';

var fs = require('fs');
var readdirp = require('readdirp');
var through = require('through');
var file = require('./lib/file');
var find = require('./lib/find');

/**
 * Indexes all functions found in all files found in all directories and subdirectories of the given root or the working directory.
 *
 * @name exports
 * @function
 * @param opts {Object} Options, most of which are passed to readdirp after setting the following defaults if they weren't supplied:
 *    root: working directory
 *    fileFilter: '*.js'
 *    directoryFilter: [ '!.git', '!.svn', '!node_modules' ]
 *  Options not passed to readdirp:
 *    indexes: previously gathered indexes to which extra ones should be added, defaults to {}
 * @param cb {Function} called back with the function locations indexed by the md5 hash of the Function.toString() values
 */
var go = module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = null;
  }

  opts = opts || {};
  opts.root            =  opts.root            || process.cwd();
  opts.fileFilter      =  opts.fileFilter      || '*.js';
  opts.directoryFilter =  opts.directoryFilter || [ '!.git', '!.svn', '!node_modules' ];

  var indexes = opts.indexes || {};
  if (!indexes.find) indexes.find = find.bind(indexes);

  function ondata (entry) {
    fs.readFile(entry.fullPath, 'utf8', function (err, js) {
      if (err) return cb(err);

      file(js, entry.fullPath, indexes);
      if (opts.debug) {
        process.stdout.write('.');
        if (indexes.error) {
          console.error('\nUnable to parse: ', indexes.error.file);
          console.error(indexes.error.error);
          delete indexes.error;
        }
      }

      this.queue(null);
    }.bind(this));
  }

  function onend () {
    if (opts.debug) process.stdout.write('\n');
    cb(null, indexes);
    this.queue(null);
  }

  // TODO: onend seems to happen before all files were indexed, and thus this calls back too soon
  readdirp(opts).pipe(through(ondata, onend));
};
go.file = file;
