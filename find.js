'use strict';
var getHash = require('./get-hash');

module.exports = function (fn) {
  var s = typeof fn === 'function' ? fn.toString() : fn;
  var hash = getHash(s);
  return this[hash];
};
