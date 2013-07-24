'use strict';
/*jshint asi: true */

var test      =  require('tape')
var fs        =  require('fs');
var indexFile =  require('../file')

test('\nindexing file with one root declaration', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-dec.js', 'utf8');
  var foo = require('./fixtures/one-root-dec');

  var index = indexFile(src);

  t.ok(index.find(foo));
  t.end();
})

test('\nindexing file with one root expression', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-exp.js', 'utf8');
  var foo = require('./fixtures/one-root-exp');

  var index = indexFile(src);

  t.ok(index.find(foo));
  t.end();
})

test('\nindexing file with one root and one nested declaration', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-one-nested-dec.js', 'utf8');
  var mod = require('./fixtures/one-root-one-nested-dec');

  var index = indexFile(src);

  t.ok(index.find(mod.foo));
  t.ok(index.find(mod.bar));
  t.end();
})

test('\nindexing file with one root and one nested expression', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-one-nested-exp.js', 'utf8');
  var mod = require('./fixtures/one-root-one-nested-exp');

  var index = indexFile(src);

  t.ok(index.find(mod.foo));
  t.ok(index.find(mod.bar));
  t.end();
})
