# Promise

<a href="http://promises-aplus.github.com/promises-spec"><img
src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png"
align="right" /></a>

A tiny [Promises/A+](https://github.com/promises-aplus/promises-spec)
implementation, created as an exercise but fully functional.

**Size minified:** 912 bytes  
**Size minified + gzipped:** 251 bytes


## Usage

Download the files `promise.js` or `promise.min.js` and include them in the page
with

    <script src="promise.min.js"></script>

The library will create a global variable `P`. To avoid conflicts with other 
libraries or values, you can call the `noConflict` method. This method restores
the original value of `P` and returns a reference to the promise function.

    var myPromiseName = P.noConflict();

`P` is a function which returns a new promise. The function accepts a callback
which is passed two arguments: a function to resolve the promise and a function
to reject it. Unlike callbacks passed to `.then`, this callback is executed 
*synchronously*.

```
var promise = P(function(resolve, reject) {
    // do stuff

    // then resolve the promise
    resolve(result);

    // or reject it
    reject('error');
});
```

You can create a resolved promise by passing a value other than a function:

    var promise = P(42);


Each promise has a `then` method to add resolution and rejection callbacks:

```
promise.then(function(resolution_value) {
    // this is called when the promise is resolved
}, function(rejection_reason) {
    // this is called when the promise is rejected
});
```

`then` always returns a new promise, which gets resolved (or rejected) with

- the value returned by resolution (or rejection) callback
- the value with which the promise returned by the resolution (or rejection)
  callback gets resolved (rejected)

Examples:

```
var promise = P(42);

var promise1 = promise.then(function(v) {
  // v = 42
  console.log('Original value: ' + v);
});

promise1.then(function(v) {
  // since the resolution callback does not return a value, `v` is `undefined`
  console.log('No return: ' + v);
});


var promise2 = promise.then(function(v) {
  // instead of just processing `v`, return a new value
  return v / 2;
});

promise2.then(function(v) {
  // v is the value returned by the other resolution callback, i.e. 
  // 42 / 2 = 21
  console.log('Processed data (return): ' + v);
});


promise3 = promise.then(function(v) {
  return P(function(resolve) {
    // do async stuff
    setTimeout(function() {
      resolve('async');
    }, v * v);
  });
});

promise3.then(function(v) {
  console.log('Processed data (promise): ' + v); // logs 'async'
});
```
