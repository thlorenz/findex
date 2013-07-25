'use strict';
/*jshint asi: true */

var debug =  false;
var test  =  debug  ? function () {} : require('tape')
var test_ =  !debug ? function () {} : require('tape')

var fs        =  require('fs');
var indexFile =  require('../file');

test('\nindexing file with one root declaration', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-dec.js', 'utf8');
  var foo = require('./fixtures/one-root-dec');

  var index = indexFile(src);

  t.ok(index.find(foo));

  t.notOk(index.find(test));

  t.end();
})

test('\nindexing file with one root expression', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-exp.js', 'utf8');
  var foo = require('./fixtures/one-root-exp');

  var index = indexFile(src);

  t.ok(index.find(foo));

  t.notOk(index.find(test));

  t.end();
})

test('\nindexing file with one root and one nested declaration', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-one-nested-dec.js', 'utf8');
  var mod = require('./fixtures/one-root-one-nested-dec');

  var index = indexFile(src);

  t.ok(index.find(mod.foo));
  t.ok(index.find(mod.bar));

  t.notOk(index.find(test));

  t.end();
})

test('\nindexing file with one root and one nested expression', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-one-nested-exp.js', 'utf8');
  var mod = require('./fixtures/one-root-one-nested-exp');

  var index = indexFile(src);

  t.ok(index.find(mod.foo));
  t.ok(index.find(mod.bar));

  t.notOk(index.find(test));

  t.end();
})

test('\nindexing file with mixed declarations and expressions, including a one liner', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/lots-of-root-and-nested-mixed.js', 'utf8');
  var mod = require('./fixtures/lots-of-root-and-nested-mixed')();

  var index = indexFile(src);

  t.ok(index.find(mod.foo));
  t.ok(index.find(mod.bar));

  t.ok(index.find(mod.foobar));
  t.ok(index.find(mod.hex));

  t.notOk(index.find(test));

  t.end()
})

test('\nindexing file with functions that have different spacings', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/different-spacings.js', 'utf8');
  var mod = require('./fixtures/different-spacings');

  var index = indexFile(src);

  t.ok(index.find(mod.foo));
  t.ok(index.find(mod.hex));

  t.ok(index.find(mod.bar));

  t.notOk(index.find(test));

  t.end()
})

test('\nindexing function expression that returns an anonymous function', function (t) {

  var src = fs.readFileSync(__dirname + '/fixtures/one-root-exp-returning-anonymous-fn.js', 'utf8');
  var mod = require('./fixtures/one-root-exp-returning-anonymous-fn');

  var index = indexFile(src);

  t.ok(index.find(mod()))
  t.ok(index.find(mod))

  t.end();
})

test('\nindexing file with return statement considered illegal by esprima', function (t) {

  var src = fs.readFileSync(__dirname + '/fixtures/source-has-illegal-return.js', 'utf8');
  var mod = require('./fixtures/source-has-illegal-return');

  var index = indexFile(src);

  t.ok(index.find(mod))

  t.end();
})
