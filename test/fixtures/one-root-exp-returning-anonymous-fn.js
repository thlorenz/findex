module.exports = function (dir, options) {

  return function middleware (req, res, next) {

    try {
      var pathname = '';
    }
    catch (err) {
      return console.log(res, next, { error: err });
    }
  };
};
