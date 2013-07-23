'use strict';

var fs = require('fs');
var readdirp = require('readdirp');
var through = require('through');
var file = require('./file');
var find = require('./find');

/**
 * Indexes all functions found in all files found in all directories and subdirectories of the given root or the working directory.
 *
 * @name exports
 * @function
 * @param opts {Object} passed to readdirp after setting the following defaults if they weren't supplied:
 *    root: working directory
 *    fileFilter: '*.js'
 *    directoryFilter: [ '!.git', '!.svn', '!node_modules' ]
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

  var indexes = {};
  indexes.find = find.bind(indexes);

  function ondata (entry) {
    fs.readFile(entry.fullPath, 'utf8', function (err, js) {
      if (err) return cb(err);
      file(js, entry.fullPath, indexes);
      this.queue(null);
    }.bind(this));
  }

  function onend () {
    cb(null, indexes);
    this.queue(null);
  }

  readdirp(opts).pipe(through(ondata, onend));
};
go.file = file;

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

// Test
if (!module.parent) {
  go(function (err, index) {
    if (err) return console.error(err);
    console.log(index.find(file));
  });
}
