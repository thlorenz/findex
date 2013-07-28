'use strict';
/*jshint asi: true */

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

// don't run in browser or node 0.8
if (typeof navigator === 'undefined' && parseFloat(process.versions.node) !== 0.8) {

var debug //= true;
var test =   debug ? function () {} : require('tape')
var test_ = !debug ? function () {} : require('tape')

var findex = require('..')
var esprima = require('esprima')
var select = require('JSONSelect')
// browserify blows up during require due to illegal return
var ecstaticName = 'ecstatic';
var ecstatic = require(ecstaticName)

test('\nwhen indexing esprima', function (t) {
  t.plan(4)

  findex({ root: __dirname + '/../node_modules/esprima', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    t.ok(index.find(esprima.parse), 'finds esprima.parse')
    t.notOk(index.find(esprima.version), 'does not find esprima.version because it is a string')
    t.notOk(index.find(select.match), 'does not find select.match because it was not indexed')
  });
})

test('\nwhen indexing JSONSelect', function (t) {
  t.plan(7)

  findex({ root: __dirname + '/../node_modules/JSONSelect', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    t.ok(index.find(select.match), 'finds select.match')
    t.ok(index.find(select.forEach), 'finds select.forEach')
    t.ok(index.find(select.compile), 'finds select.compile')
    t.ok(index.find(select._parse), 'finds select._parse')
    t.ok(index.find(select._lex), 'finds select._lex')
    t.notOk(index.find(esprima.parse), 'does not find esprima.parse because it was not indexed')
  });
})

test('\nwhen indexing ecstatic', function (t) {
  t.plan(3)

  findex({ root: __dirname + '/../node_modules/ecstatic', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    t.ok(index.find(ecstatic), 'finds ecstatic')
    t.ok(index.find(ecstatic.showDir), 'finds ecstatic.showDir')
  });
})

test('\nwhen indexing esprima followed by ecstatic, propagating indexes', function (t) {
  t.plan(7)

  findex({ root: __dirname + '/../node_modules/esprima', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    t.ok(index.find(esprima.parse), 'finds esprima.parse')
    t.equal(index.indexedDirs.length, 3, 'has 3 indexed esprima project dirs')


    findex({ root: __dirname + '/../node_modules/ecstatic', debug: true, indexes: index }, function (err, index) {
      t.notOk(err, 'no error')

      t.equal(index.indexedDirs.length, 3 + 10, 'has 3 indexed esprima and 10 indexed ecstatic project dirs')
      t.ok(index.find(ecstatic), 'finds ecstatic')
      t.ok(index.find(ecstatic.showDir), 'finds ecstatic.showDir')
    });
  });
})

test('\nwhen indexing everything, except some huge modules', function (t) {
  t.plan(10)

  findex({
        root: __dirname + '/../'
      , directoryFilter: [ '!.git', '!browserify', '!tap', '!testling' ]
      , debug: true }
    , function (err, index) {
        t.notOk(err, 'no error')

        t.ok(index.find(select.match), 'finds select.match')
        t.ok(index.find(select.forEach), 'finds select.forEach')
        t.ok(index.find(select.compile), 'finds select.compile')
        t.ok(index.find(select._parse), 'finds select._parse')
        t.ok(index.find(select._lex), 'finds select._lex')
        t.ok(index.find(esprima.parse), 'finds esprima.parse')
        t.ok(index.find(ecstatic), 'finds ecstatic')
        t.ok(index.find(ecstatic.showDir), 'finds ecstatic.showDir')

        t.ok(index.find(test), 'finds this test')
    });
})

}
