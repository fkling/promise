/*jshint node: true, newcap: false */

var P = require('../promise').P;

exports.pending = function() {
  "use strict";
  var fulfill, reject;
  var promise = P(function(f, r) {
    fulfill = f;
    reject = r;
  });
  return {
    promise: promise,
    fulfill: fulfill,
    reject: reject
  };
};
