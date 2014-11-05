'use strict';

var CI = process.env.CI;

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'browserify'],
    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './test/index.js'
    ],
    preprocessors: {
      './test/index.js': ['browserify']
    },
    reporters: CI ? ['progress', 'coverage'] : ['progress'],
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
