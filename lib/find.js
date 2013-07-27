'use strict';
var getHash = require('./get-hash');

/**
 * find function that is attached to the indexes after they have been created.
 * It is part of the API since sometimes it needs to be recreated manually,
 * i.e. when a new indexes instance is created by extending one set of indexes with another one
 *
 * @name find
 * @function
 * @param this {Object} bind the indexes to this function, i.e.: var f = find.bind(indexes); f(fn);
 * @param fn {Function} the function or Function.toString() representation of the function to find
 * @return {[Object]} locations information about the function, including file, line, column and range
 */
module.exports = function (fn) {
  var s = typeof fn === 'function' ? fn.toString() : fn;
  var hash = getHash(s);
  return this[hash];
};
