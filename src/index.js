'use strict';

require('angular')
  .module('convex-firebase', [
    'convex'
  ])
  .run(require('./model'))
  .run(require('./collection'));

module.exports = 'convex-firebase';
