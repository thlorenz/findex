'use strict';

var fs = require('fs');
var readdirp = require('readdirp');
var through = require('through');
var file = require('./file');

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

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

// Test
if (!module.parent) {

  go(function (err, res) {
    if (err) return console.error(err);
    inspect(res);
  });
}
