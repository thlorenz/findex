'use strict';

var esprima = require('esprima');
var select = require('JSONSelect');
var getHash = require('./get-hash');
var find = require('./find');

// cheap way of detecting that we aren't running node and not in chrome either
var v8 = !(typeof navigator !== 'undefined' && navigator.userAgent && !~navigator.userAgent.indexOf('Chrome'));

function fixSourceNparseAgain (js, error) {
  // returns an ast if successfull or null if not

  var illegalReturn = /^Line \d+: Illegal return statement$/.test(error.message);
  if (illegalReturn) {
    var lines = js.split('\n');
    var idx = error.lineNumber - 1;

    // comment out the line with the culprit
    lines[idx] = '// ' + lines[idx];
    try {
      return esprima.parse(lines.join('\n'), { range: true, loc: true });
    } catch (e) { return null; }
  }
  else return null;
}

function entryIndexedBefore (entries, entry) {
  return entries.some(function (e) {
      return e.file === entry.file
        && e.range[0] === entry.range[0]
        && e.range[1] === entry.range[1];
    });
}

function index(indexes, source, fullPath, loc, range) {
  var hash  =  getHash(source);
  var locS  =  loc.start;
  var locE  =  loc.end;

  // the exact same function could exist in multiple files, so we have to store all locations
  if (!indexes[hash]) indexes[hash] = [];

  var entry = {
      file  :  fullPath
    , start :  locS
    , end   :  locE
    , lines :  locE.line - locS.line
    , range :  range
  };
  var entries = indexes[hash];

  if (!entryIndexedBefore(entries, entry)) entries.push(entry);
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

    // breaks more than it fixes at this point and
    // may not be important anymore since 99% evaling the function succeeds
    // .replace(/^function([^\(]+?)\( *(.*?) *\)/, 'function $1 ($2)')   // function ( a ) {   => function (a) {
}

function locateNindex (indexes, js, fullPath, ranges, locs, areDecs) {
  ranges.forEach(function (range, idx) {
    var start =  range[0];
    var end   =  range[1];

    var loc   =  locs[idx];
    var locS  =  loc.start;
    var locE  =  loc.end;

    var source;
    var fnsrc = js.slice(start, end);
    var fn;

    try {
      // Best way to normalize the function string:
      // using the actual .toString() of the js interpreter
      // (instead of our own attempts to normalize the string representation of the function)
      // makes sure that functions that are .toString()ed later to compare will match 100% of the time
      /* jshint evil: true */
      fn = eval('(function () { return ' + fnsrc + '})();');
      source = fn.toString();
    } catch (e) {
      // best way blew up? ahw .. try second best :P ...
      source = areDecs ? rewriteDec(fnsrc) : rewriteExp(fnsrc);
      source = rewriteNotV8(source);
    }

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
 * @return {Object} the updated indexes which will have an `error` property if one occurred
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
    // if esprima cannot parse the code, we are pretty muc hosed
    ast = fixSourceNparseAgain(js, e);

    // if fix attempt returned null that means there was nothing we can do here
    if (ast === null) {
      indexes.error = { error: e, file: fullPath };
      return indexes;
    }
  }

  var decRanges = select.match('.type:val("FunctionDeclaration") ~ .range', ast);
  var decLocs = select.match('.type:val("FunctionDeclaration") ~ .loc', ast);

  var expRanges = select.match('.type:val("FunctionExpression") ~ .range', ast);
  var expLocs = select.match('.type:val("FunctionExpression") ~ .loc', ast);

  locateNindex(indexes, js, fullPath, decRanges, decLocs, true);
  locateNindex(indexes, js, fullPath, expRanges, expLocs, false);

  return indexes;
};
