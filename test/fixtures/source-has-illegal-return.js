'use strict';

var go = module.exports = function () {
  // ...
};

// taken from ecstatic
if(!module.parent) {
  var a = 1;
  if(a > 1) {
    var u = console.error
    u('usage: ecstatic [dir] {options} --port PORT')
    u('see https://npm.im/ecstatic for more docs')
    // esprima doesn't like these
    return
  }
}
