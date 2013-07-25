'use strict';
/*jshint asi: true */

function inspect(obj, depth) {
  console.log(require('util').inspect(obj, false, depth || 5, true));
}

// don't run in browser
if (typeof navigator === 'undefined') {

var debug// = true;
var test =   debug ? function () {} : require('tape')
var test_ = !debug ? function () {} : require('tape')

var findex = require('..')
var esprima = require('esprima')
var select = require('JSONSelect')
var ecstatic = require('ecstatic')

test('\nwhen indexing esprima', function (t) {
  findex({ root: __dirname + '/../node_modules/esprima', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    t.ok(index.find(esprima.parse), 'finds esprima.parse')
    t.notOk(index.find(esprima.version), 'does not find esprima.version because it is a string')
    t.notOk(index.find(select.match), 'does not find select.match because it was not indexed')
    t.end()

  });
})

test('\nwhen indexing JSONSelect', function (t) {
  findex({ root: __dirname + '/../node_modules/JSONSelect', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    t.ok(index.find(select.match), 'finds select.match')
    t.ok(index.find(select.forEach), 'finds select.forEach')
    t.ok(index.find(select.compile), 'finds select.compile')
    t.ok(index.find(select._parse), 'finds select._parse')
    t.ok(index.find(select._lex), 'finds select._lex')
    t.notOk(index.find(esprima.parse), 'does not find esprima.parse because it was not indexed')
    t.end()

  });
})

test('\nwhen indexing ecstatic', function (t) {
  findex({ root: __dirname + '/../node_modules/ecstatic', debug: true }, function (err, index) {
    t.notOk(err, 'no error')

    inspect(index);
    t.ok(index.find(ecstatic), 'finds ecstatic')
    t.ok(index.find(ecstatic.showDir), 'finds ecstatic.showDir')
    t.end()

  });
})

test('\nwhen indexing everything, except some huge modules', function (t) {
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

        t.end()

    });
})

}
