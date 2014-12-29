'use strict';

var angular = require('angular');

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

  var Firebase, $timeout, $rootScope, Model, model;
  beforeEach(angular.mock.inject(function ($injector) {
    Firebase = $injector.get('Firebase');
    $timeout = $injector.get('$timeout');
    $rootScope = $injector.get('$rootScope');
    var ConvexModel = $injector.get('ConvexModel');
    Model = ConvexModel.extend({
      $name: 'user'
    });
    model = new Model();
  }));

  describe('#$ref', function () {

    it('can generate a reference using $path', function () {
      model.$path = function () {
        return '/user/ben';
      };
      expect(model.$ref().currentPath).to.equal('Mock://user/ben');
    });

    it('can generate a reference using a firebase path override', function () {
      model.$path = function () {
        return '$path';
      };
      model.$firebase = {
        path: function () {
          return '/user/ben';
        }
      };
      expect(model.$ref().currentPath).to.equal('Mock://user/ben');
    });

    it('can generate root collection refs', function () {
      expect(model.$ref(true).currentPath).to.equal('Mock://users');
      model.$firebase = {
        path: function (collection) {
          return !collection ? '/users/ben' : '/users';
        }
      };
      expect(model.$ref(true).currentPath).to.equal('Mock://users');
    });

    it('calls $firebase#path on the model', function () {
      model.$firebase = {
        path: function () {
          return this.$name + '/ben';
        }
      };
      expect(model.$ref().currentPath).to.equal('Mock://user/ben');
    });

    it('calls $firebase#path with a collection if provided', function () {
      model.$firebase = {
        path: function (collection) {
          return collection.myPath;
        }
      };
      expect(model.$ref({myPath: 'bar'}).currentPath).to.equal('Mock://bar');
    });

  });

  describe('#$subscribe', function () {

    var ref;
    beforeEach(function () {
      ref = new Firebase();
      sinon.stub(model, '$ref').returns(ref);
    });

    it('resolves the model when data first arrives', function () {
      expect(model.$subscribe()).to.eventually.equal(model);
      ref.child('foo').set('bar');
      ref.flush();
      $timeout.flush();
    });

    it('rejects when data cannot be fetched', function () {
      var err = new Error();
      ref.failNext('once', err);
      expect(model.$subscribe()).to.be.rejectedWith(err);
      ref.flush();
      $timeout.flush();
    });

    it('can subscribe to updates on a single key', function () {
      model.$subscribe('foo');
      ref.child('foo').set('bar');
      ref.child('bar').set('baz');
      ref.flush();
      $rootScope.$digest();
      expect(model.foo).to.equal('bar');
      expect(model.bar).to.equal(undefined);
    });

    it('can subscribe to updates on a single key with prefix', function () {
      model.$subscribe('foo', true);
      ref.child('foo').set('bar');
      ref.flush();
      $rootScope.$digest();
      expect(model.$$foo).to.equal('bar');
    });

    it('can subscribe to updates on multiple keys', function () {
      model.$subscribe(['foo', 'bar']);
      ref.child('foo').set('bar');
      ref.child('bar').set('baz');
      ref.flush();
      $rootScope.$digest();
      expect(model.foo).to.equal('bar');
      expect(model.bar).to.equal('baz');
    });

    it('can subscribe to updates on the whole object', function () {
      model.$subscribe();
      ref.child('foo').set('bar');
      ref.flush();
      $rootScope.$digest();
      expect(model.foo).to.equal('bar');
    });

  });

};
