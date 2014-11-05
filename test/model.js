'use strict';

var angular = require('angular');

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

  var Firebase, $timeout, Model, model;
  beforeEach(angular.mock.inject(function (_Firebase_, _$timeout_, ConvexModel) {
    Firebase = _Firebase_;
    $timeout = _$timeout_;
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
      expect(model.foo).to.equal('bar');
      expect(model.bar).to.be.undefined;
    });

    it('can subscribe to updates on a single key with prefix', function () {
      model.$subscribe('foo', true);
      ref.child('foo').set('bar');
      ref.flush();
      expect(model.$$foo).to.equal('bar');
    });

    it('can subscribe to updates on multiple keys', function () {
      model.$subscribe(['foo', 'bar']);
      ref.child('foo').set('bar');
      ref.child('bar').set('baz');
      ref.flush();
      expect(model.foo).to.equal('bar');
      expect(model.bar).to.equal('baz');
    });

    it('can subscribe to updates on the whole object', function () {
      model.$subscribe();
      ref.child('foo').set('bar');
      ref.flush();
      expect(model.foo).to.equal('bar');
    });

  });

};
