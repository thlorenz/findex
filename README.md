# findex [![build status](https://secure.travis-ci.org/thlorenz/findex.png)](http://travis-ci.org/thlorenz/findex)

[![testling badge](https://ci.testling.com/thlorenz/findex.png)](https://ci.testling.com/thlorenz/findex)

Indexes locations of functions inside a project by the md5 hash of the function string to find them later.

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

## Installation

    npm install findex

## API

###*findex(opts, cb)*

```
/**
 * Indexes all functions found in all files found in all directories and subdirectories of the given root or the working directory.
 *
 * @name exports
 * @function
 * @param opts {Object} passed to readdirp after setting the following defaults if they weren't supplied:
 *    root: working directory
 *    fileFilter: '*.js'
 *    directoryFilter: [ '!.git', '!.svn', '!node_modules' ]
 * @param cb {Function} called back with the function locations indexed by the md5 hash of the Function.toString() values
 */
```


###*findex.file(js, fullPath, indexes)*

```
/**
 * Indexes all functions in the given file content and adds them to the given indexes.
 *
 * @name exports
 * @function
 * @param js {String} the JavaScript file content
 * @param fullPath {String} full path at which the file can be found (optional, defaults to 'source.js')
 * @param indexes {Object} indexes that have been collected so far (optional, defaults to {})
 * @return {Object} the updated indexes which will have an `error` property if one occurred
 */
```


## License

MIT
