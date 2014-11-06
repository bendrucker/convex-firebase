'use strict';

var CI = process.env.CI;

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai-sinon', 'browserify'],
    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/chai-as-promised/lib/chai-as-promised.js',
      './node_modules/es5-shim/es5-shim.js',
      './test/index.js'
    ],
    preprocessors: {
      './test/index.js': ['browserify']
    },
    browserify: {
      debug: true,
      transform: CI ? ['browserify-istanbul', 'browserify-shim'] : ['browserify-shim']
    },
    reporters: CI ? ['progress', 'coverage'] : ['progress'],
    coverageReporter: {
      type: 'lcov',
      dir: './coverage',
      subdir: './'
    },
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false
  });
};
