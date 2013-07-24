'use strict';
/*jshint asi: true */

var test      =  require('tape')
var fs        =  require('fs');
var indexFile =  require('..').file

test('\nindexing file with one root declaration', function (t) {
  //  removed for now to not have to deal with transform yet
//  var src = fs.readFileSync(__dirname + '/fixtures/one-root-dec.js', 'utf8');
  var foo = require('./fixtures/one-root-dec');

  var src = foo.toString();
  var index = indexFile(src);

  t.ok(index.find(foo));
  t.end();
})
