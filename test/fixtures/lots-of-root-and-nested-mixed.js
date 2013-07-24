'use strict';

// test that module exports assignment works
var go = module.exports = function () {
  function foo (a, b, c) {
    function bar () {
      console.log('logged from inside bar');
    }
    return bar;
  }

  // this one is poorly formatted on purpose
  function foobar  (a, cc)   {
    // testing one liner
    var hex = function () { return 'hex'; };
    return hex;
  }

  return {
    foo    :  foo
  , bar    :  foo()
  , foobar :  foobar
  , hex    :  foobar()
  };
};
