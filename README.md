# findex
[![build status](https://secure.travis-ci.org/thlorenz/findex.png)](http://travis-ci.org/thlorenz/findex)

Indexes locations of functions inside a project by the checksum of the function string to find them later.

```js
var findex = require('findex');

function functionToFind() {
  console.log('as you can see I am on lines 4 - 6 in indexNFind.js');
}

functionToFind();

findex(function (err, index) {
  if (err) return console.error(err);
  console.log(index.find(functionToFind));
});
```

## Status

Alpha - most functionality is there, none tested yet.

Also API docs are coming.

## Installation

    npm install findex

## API


## License

MIT
