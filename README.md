# findex [![build status](https://secure.travis-ci.org/thlorenz/findex.png)](http://travis-ci.org/thlorenz/findex)

[![testling badge](https://ci.testling.com/thlorenz/findex.png)](https://ci.testling.com/thlorenz/findex)

findex will work in pretty much all browsers except for some edge cases and is 100% consistent when run in a `v8`
environment like nodejs or Chrome.

Indexes locations of functions inside a project by the checksum of the function string to find them later.

```js
'use strict';
var findex = require('findex');

function functionToFind() {
  console.log('as you can see I am on lines 4 - 6 in indexNFind.js');
}

findex(function (err, index) {
  if (err) return console.error(err);
  console.log(index.find(functionToFind));
});
```

```
[ { file: '/Users/thlorenz/dev/js/projects/findex/example/indexNfind.js',
    start: { line: 4, column: 0 },
    end: { line: 6, column: 1 },
    lines: 2,
    range: [ 43, 142 ] } ]
```

## Status

API docs are coming.

## Installation

    npm install findex

## API


## License

MIT
