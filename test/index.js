'use strict';

var angular = require('angular');
require('convex');

describe('convex-firebase', function () {

  beforeEach(angular.mock.module(require('../')));

  it('exposes firebase', angular.mock.inject(function (Firebase) {
    expect(Firebase).to.equal(require('firebase'));
  }));

  describe('ConvexModel', require('./model'));
  describe('ConvexCollection', require('./collection'));

});
