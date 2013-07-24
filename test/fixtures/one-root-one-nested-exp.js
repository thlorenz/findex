var foo = function  ff  (a, b, c) {
  var bar = function () {
    console.log('logged from inside foo');
  };
  return bar;
};
exports.foo = foo;
exports.bar = foo();
