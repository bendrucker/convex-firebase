'use strict';

var CI = process.env.CI;

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'browserify'],
    files: [
      './test/**/*.js'
    ],
    preprocessors: {
      './test/**/*.js': ['browserify']
    },
    reporters: CI ? ['progress', 'coverage'] : ['progress'],
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
