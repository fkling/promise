/*jshint node:true*/
var promisesAplusTests = require("promises-aplus-tests");
var adapter = require('./test/adapter');


module.exports = function(grunt) {
  "use strict";
  // Project configuration.
  grunt.initConfig({
    uglify: {
      options: {
        report: 'gzip'
      },
      my_target: {
        files: {
          'promise.min.js': ['promise.js']
        }
      }
    },
    test: {}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', 'Test implementation', function() {
    var done = this.async();
    promisesAplusTests(adapter, done);
  });
};
