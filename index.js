'use strict';

var esprima = require('esprima');
var select = require('JSONSelect');
var crypto = require('crypto');

function getHash(data) {
  return crypto
    .createHash('md5')
    .update(data)
    .digest('hex');
}

function rewrite (fn) {
  // toString() on a function converts 'function  foo (..' to 'function foo(..' so we need to do the same
  return fn.replace(/function +([^ ]+)[^\(]*\(/, 'function $1(');
}

var go = module.exports = function (file) {

};


var fs = require('fs');
var p = __dirname + '/test/fixtures/one-root-dec.js';
var js = fs.readFileSync(p, 'utf8');
var fn = require(p);

var ast = esprima.parse(js, { range: true, loc: true });

var ranges = select.match('.type:val("FunctionDeclaration") ~ .range', ast)

var locs = select.match('.type:val("FunctionDeclaration") ~ .loc', ast)

var hashes = {};
var fullPath = p;

ranges.forEach(function (range, idx) {
  var start =  range[0];
  var end   =  range[1];

  var loc   =  locs[idx];
  var locS  =  loc.start;
  var locE  =  loc.end;

  var fn = js.slice(start, end - start);
  var source = rewrite(fn);
  var hash = getHash(source);

  // the exact same function could exist in multiple files, so we have to store all locations
  if (!hashes[hash]) hashes[hash] = [];
  hashes[hash].push({
      file  :  fullPath
    , start :  locS
    , end   :  locE
    , lines :  locE.line - locS.line
    , range :  range
  });
});
