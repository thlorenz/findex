function foo (a, b, c) {
  function bar () {
    console.log('logged from inside bar');
  }
  return bar;
}
exports.foo = foo;
exports.bar = foo();
