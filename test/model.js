'use strict';

var angular = require('angular');

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

  var Firebase, Model, model;
  beforeEach(angular.mock.inject(function (_Firebase_, ConvexModel) {
    Firebase = _Firebase_;
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
      expect(model.$ref().currentPath).to.equal('Mock://user/ben');
    });

    it('calls $firebase#path on the model', function () {
      model.$firebase = {
        path: function () {
          return this.$name + '/ben'
        }
      };
      expect(model.$ref().currentPath).to.equal('Mock://user/ben');
    });

  });

  describe('#$subscribe', function () {

    var ref;
    beforeEach(function () {
      ref = new Firebase();
    });

    describe('scoped', function () {

      it('can subscribe to updates on a single key', function () {
        // model.
      });

    });

    describe('whole object', function () {

    });

  });

};
