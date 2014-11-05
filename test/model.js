'use strict';

var angular = require('angular');

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

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

    it('calls $firebase#path on the model', function () {
      model.$firebase = {
        path: function () {
          return this.$name + '/ben'
        }
      };
      expect(model.$ref().currentPath).to.equal('mock://user/ben');
    });

  });

};
