'use strict';

module.exports = require('angular')
  .module('convex-firebase', [
    'convex'
  ])
  .value('Firebase', require('firebase'))
  .config(['$provide', function ($provide) {
    $provide.decorator('ConvexModel', require('./model'));
    $provide.decorator('ConvexCollection', require('./collection'));
  }])
  .name;
