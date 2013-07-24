
function     foo  (a, cc)    {
  // testing one liner
  var hex = function    ()   { return 'hex'; };
  return hex;
}

// TODO: make this work in non-v8 envs
var bar = function (  )   { return 'bar'; };

exports.foo = foo;
exports.hex = foo();
exports.bar = bar;
