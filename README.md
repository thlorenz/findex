# findex [![build status](https://secure.travis-ci.org/thlorenz/findex.png)](http://travis-ci.org/thlorenz/findex)

[![testling badge](https://ci.testling.com/thlorenz/findex.png)](https://ci.testling.com/thlorenz/findex)

Indexes locations of functions inside a project by the md5 hash of the function string to find them later.

```js
var findex = require('findex');

function functionToFind() {
  console.log('as you can see I am on lines 3 - 5 in indexNFind.js');
}

functionToFind();

findex(function (err, index) {
  if (err) return console.error(err);
  console.log(index.find(functionToFind));
});
```

```
[ { file: '/Users/thlorenz/dev/js/projects/findex/example/indexNfind.js',
    start: { line: 3, column: 0 },
    end: { line: 5, column: 1 },
    lines: 2,
    range: [ 29, 128 ] } ]
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
 * @param opts {Object} Options, most of which are passed to readdirp after setting the following defaults if they weren't supplied:
 *    root: working directory
 *    fileFilter: '*.js'
 *    directoryFilter: [ '!.git', '!.svn', '!node_modules' ]
 *  Options not passed to readdirp:
 *    indexes: previously gathered indexes to which extra ones should be added, defaults to {}
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

###*findex.fork(opts, cb)*

Same as findex, except that it forks a child process to do the work - AST creation can be slow.

Use this findex alternative if you evaluate lots of files (in larger projects)
and the AST creation is blocking your main process for too long.

The arguments it expects are exactly the same as [***findex(opts,
cb)***](https://github.com/thlorenz/findex#findexopts-cb) does.

###*indexes.find(fn)*

When the indexes get updated, either via ***findex()*** or ***findex.file***, a `find` method is added to them. Call
them with either a `Function` or the result of `Function.toString()` to have it return the location of that function or
`null` if it wasn't indexed.

###*indexes.indexedDirs*

This is only relevant when indexing a project (i.e. a directory and its subdirectories) and are useful in case you want
to add them to the `directoryFilter` for the next indexing operation to avoid indexing the same directory twice.


- it will contain an array of unique directories that were examined to create the indexes 
- if indexes that are passed to it already have `indexedDirs`, they will be concatenated with the ones examined

###*findex.find(fn)*

```
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
 ```

## License

MIT
