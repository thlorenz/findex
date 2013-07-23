'use strict';

var esprima = require('esprima');
var select = require('JSONSelect');

function rewrite (fn) {
  // toString() on a function converts 'function  foo (..' to 'function foo(..' so we need to do the same
  return fn.replace(/function +([^ ]+)[^\(]*\(/, 'function $1(');
}

var go = module.exports = function (js) {

};


var fs = require('fs');
var p = __dirname + '/test/fixtures/one-root-dec.js';
var js = fs.readFileSync(p, 'utf8');
var fn = require(p);

var ast = esprima.parse(js, { range: true });
var decs = select.match('.type:val("FunctionDeclaration") ~ .range', ast);

var sources = decs.map(function (range) {
  var start = range[0];
  var end = range[1];

  // parse and regenerate in order to adjust whitespace to be the same as fn.toString()
  var fn = js.slice(start, end - start);
  return rewrite(fn);
});

var source = sources[0];
source === fn.toString()
