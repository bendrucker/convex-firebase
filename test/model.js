'use strict';

var angular = require('angular');

module.exports = function () {

  var Model, model;
  beforeEach(angular.mock.inject(function (ConvexModel) {
    Model = ConvexModel.extend({
      $name: 'user'
    });
    model = new Model();
  }));

  describe('#$ref', function () {

    it('can generate a new Firebase reference', function () {
      model.$firebase = {
        path: function () {
          return '/user/ben';
        }
      };
      expect(model.$ref().currentPath).to.equal('mock://user/ben');
    });

  });

};
