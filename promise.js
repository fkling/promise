/**
 * A concise promise implementation following the specification of
 * http://promisesaplus.com/.
 *
 * Usage:
 *
 * var promise = P(function(resolve, reject) {
 *     // do (asynchronous) stuff
 *     resolve(result);
 * });
 *
 * promise.then(function(r) {
 *     console.log(r);
 * });
 *
 *
 * @author Felix Kling
 * @license MIT
 */

/*jshint browser:true, node: true */

(function(global) {
  "use strict";
  var PENDING = 0;
  var FULFILLED = 1;
  var REJECTED = 2;

  var enqueue = function(cb) {
    setTimeout(cb, 0);
  };

  function createHandler(onFulfilled, onRejected, fulfill, reject) {
    return function(value, fulfilled) {
      enqueue(function() {
        if (fulfilled && typeof onFulfilled !== 'function') {
          fulfill(value);
        }
        else if (!fulfilled && typeof onRejected !== 'function') {
          reject(value);
        }
        else {
          var result;
          try {
            result = (fulfilled ? onFulfilled : onRejected)(value);
          }
          catch(ex) {
              reject(ex);
          }
          fulfill(result);
        }
      });
    };
  }

  function promise(val) {
    var handlers = [];
    var state = PENDING;
    var value;
    var self;

    function resolve(x) {
      // https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (x === self) {
        reject(new TypeError('Promise cannot resolve itself'));
        return;
      }
      else if (x && state === FULFILLED) { // check if x is promise-like
        var then = x.then;
        if (typeof then === 'function') {
          try {
              state = PENDING;
              then.call(x, fulfill, reject);
          }
          catch(ex) {
            reject(ex);
          }
          return;
        }
      }
      value = x;
      for (var i = 0, l = handlers.length; i < l; i++) {
        handlers[i](x, state === FULFILLED);
      }
    }

    function fulfill(value) {
      if (state !== PENDING) {return;}
      state = FULFILLED;
      resolve(value);
    }

    function reject(reason) {
      if (state !== PENDING) {return;}
      state = REJECTED;
      resolve(reason);
    }

    if (typeof val !== 'function') {
      // fulfill promise
      fulfill(val);
    }
    else if (val && typeof val.then === 'function') { // return passed promise
      return val;
    }
    else {
      try {
        val(fulfill, reject);
      }
      catch(ex) {
        reject(ex);
      }
    }

    self = {
      then: function(onFulfilled, onRejected) {
        return promise(function(fulfill, reject) {
          var handler = createHandler(onFulfilled, onRejected, fulfill, reject);
          if (state === PENDING) {
            handlers.push(handler);
          }
          else {
            handler(value, state === FULFILLED);
          }
        });
      }
    };
    return self;
  }

  var old_P_ = global.P;
  promise.noConflict = function() {
    delete global.P;
    if (typeof global.P !== 'undefined') {
      global.P = old_P_;
    }
    return promise;
  };

  global.P = promise;
}(typeof module === 'object' && module.exports || this));
