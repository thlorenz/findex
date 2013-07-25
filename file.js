'use strict';

var esprima = require('esprima');
var select = require('JSONSelect');
var getHash = require('./get-hash');
var find = require('./find');

// cheap way of detecting that we aren't running node and not in chrome either
var v8 = !(typeof navigator !== 'undefined' && navigator.userAgent && !~navigator.userAgent.indexOf('Chrome'));

function index(indexes, source, fullPath, loc, range) {
  var hash  =  getHash(source);
  hash  =  source;

  var locS  =  loc.start;
  var locE  =  loc.end;

  // the exact same function could exist in multiple files, so we have to store all locations
  if (!indexes[hash]) indexes[hash] = [];
  indexes[hash].push({
      file  :  fullPath
    , start :  locS
    , end   :  locE
    , lines :  locE.line - locS.line
    , range :  range
  });
}

function rewriteDec (fn) {
  // toString() on a function converts 'function  foo (..' to 'function foo(..' so we need to do the same
  return fn.replace(/function +([^ (]+)[^\(]*\(/, 'function $1(');
}

function rewriteExp (fn) {
  // if it name is declared ('var foo = function foo (..'), treat like declaration
  return (/function +[^ (]+/).test(fn)
    ? rewriteDec(fn)
    : fn.replace(/function[^\(]*\(/, 'function (');
}

function rewriteNotV8 (fn) {
  return v8
    ? fn
    : fn.replace(/\) *?\{/,') {')                                       // function ()   {    => function () {
    ;

    // TODO: breaks more than it fixes at this point
    // .replace(/^function([^\(]+?)\( *(.*?) *\)/, 'function $1 ($2)')   // function ( a ) {   => function (a) {
}

function locateNindex (indexes, js, fullPath, ranges, locs, areDecs) {
  ranges.forEach(function (range, idx) {
    var start =  range[0];
    var end   =  range[1];

    var loc   =  locs[idx];
    var locS  =  loc.start;
    var locE  =  loc.end;

    var fn = js.slice(start, end);
    var source = areDecs ? rewriteDec(fn) : rewriteExp(fn);
    source = rewriteNotV8(source);

    index(indexes, source, fullPath, loc, range);
  });
}

/**
 * Indexes all functions in the given file content and adds them to the given indexes.
 *
 * @name exports
 * @function
 * @param js {String} the JavaScript file content
 * @param fullPath {String} full path at which the file can be found (optional, defaults to 'source.js')
 * @param indexes {Object} indexes that have been collected so far (optional, defaults to {})
 * @return {Object} the updated indexes
 */
var go = module.exports = function (js, fullPath, indexes) {
  // remove hashbang
  js = js.replace(/^\#\!.+/, '');

  fullPath = fullPath || 'source.js';
  indexes = indexes || {};
  if (!indexes.find) indexes.find = find.bind(indexes);

  var ast;
  try {
    ast = esprima.parse(js, { range: true, loc: true });
  } catch (e) {
    // if esprima cannot parse the code, we are hosed
    indexes.error = { error: e, file: fullPath };
    return indexes;
  }

  var decRanges = select.match('.type:val("FunctionDeclaration") ~ .range', ast);
  var decLocs = select.match('.type:val("FunctionDeclaration") ~ .loc', ast);

  var expRanges = select.match('.type:val("FunctionExpression") ~ .range', ast);
  var expLocs = select.match('.type:val("FunctionExpression") ~ .loc', ast);

//  locateNindex(indexes, js, fullPath, decRanges, decLocs, true);
  locateNindex(indexes, js, fullPath, expRanges, expLocs, false);

  return indexes;
};

// Test
if (!module.parent) {
  /*var cardinal = require('cardinal');
  var fs = require('fs');
  var index = go(fs.readFileSync(__dirname + '/test/fixtures/one-root-exp-returning-anonymous-fn.js', 'utf8'));
  var mod = require('./test/fixtures/one-root-exp-returning-anonymous-fn');

  console.log('++++++++++++++++++');
  Object.keys(index)
    .filter(function (k) { return k !== 'find'; })
    .forEach(function (k) {
      console.log(k + '\n\n');
    });

  console.log('=================');

//  console.log(mod.toString());
  console.log(mod().toString());*/


 var fns = 'function foo () { console.log(1); }';
 var fn = eval('(function () { return ' + fns + '})();');

 console.log(fn.toString());
}
