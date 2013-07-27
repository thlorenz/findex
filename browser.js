'use strict';

var exports = module.exports = function () {
  throw new Error('running findex on an entire project directory only works server side, pleas try findex.file(source) instead.');
};
exports.file = require('./lib/file');
