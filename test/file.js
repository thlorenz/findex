'use strict';
/*jshint asi: true */

var debug =  false;
var test  =  debug  ? function () {} : require('tape')
var test_ =  !debug ? function () {} : require('tape')

var fs        =  require('fs');
var indexFile =  require('../lib/file');

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

test('\nindexing file with one root expression twice with same file and location', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-exp.js', 'utf8');
  var foo = require('./fixtures/one-root-exp');

  var index = indexFile(src, 'uno.js');

  t.equal(index.find(foo).length, 1, 'has one function indexed after first time');

  index = indexFile(src, 'uno.js', index);
  t.equal(index.find(foo).length, 1, 'has one function indexed after second time');

  t.end();
})

test('\nindexing file with one root expression twice with different file, same location', function (t) {
  var src = fs.readFileSync(__dirname + '/fixtures/one-root-exp.js', 'utf8');
  var foo = require('./fixtures/one-root-exp');

  var index = indexFile(src, 'uno.js');

  t.equal(index.find(foo).length, 1, 'has one function indexed after first time')

  index = indexFile(src, 'dos.js', index);

  var locs = index.find(foo);
  t.equal(locs.length, 2, 'has two functions indexed after second time')
  t.equal(locs[0].file, 'uno.js', 'first location is for first file')
  t.equal(locs[1].file, 'dos.js', 'second location is for second file')

  t.end();
})

// that file breaks browserify since it has an illegal return statement ;)
if (typeof navigator === 'undefined') {
  test('\nindexing file with return statement considered illegal by esprima', function (t) {

    var filename = __dirname + '/fixtures/source-has-illegal-return.js';
    // made async to stop brfs from trying to source it
    fs.readFile(filename, 'utf8', function (err, src) {
      var mod = require(filename);
      var index = indexFile(src);

      t.ok(index.find(mod))

      t.end();
    });
  })
}
