'use strict';

require('angular')
  .module('convex-firebase', [
    'convex'
  ])
  .value('Firebase', require('firebase'))
  .run(require('./model'))
  .run(require('./collection'));

module.exports = 'convex-firebase';
