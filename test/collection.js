'use strict';

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

  var Firebase, $timeout, $rootScope, Collection, Model, model, collection;
  beforeEach(angular.mock.inject(function ($injector) {
    Firebase = $injector.get('Firebase');
    $timeout = $injector.get('$timeout');
    $rootScope = $injector.get('$rootScope');

    var ConvexModel = $injector.get('ConvexModel');
    Collection = $injector.get('ConvexCollection');
    Model = ConvexModel.extend({
      $name: 'user'
    });
    model = new Model();
    collection = new Collection(Model);
  }));

  describe('#$ref', function () {

    it('can get a reference from its model', function () {
      expect(collection.$ref().currentPath).to.equal('Mock://users');
    });

    it('can passes itself to model#$ref', function () {
      collection.$related('owner', {
        id: 'theOwner'
      });
      Model.prototype.$firebase = {
        path: function (withId, collection) {
          return '/owners/' + collection.$related('owner').id + '/models'
        }
      }
      expect(collection.$ref().currentPath).to.equal('Mock://owners/theOwner/models');
    });

  });

  describe('#$query', function () {

    var ref, query;
    beforeEach(function () {
      ref = new Firebase();
      sinon.stub(Model.prototype, '$ref').returns(ref);
      query = {};
    });

    it('can apply a one argument query', function () {
      Model.prototype.$firebase = {
        query: {
          limitToLast: 5
        }
      };
      ref.limitToLast = sinon.stub().returns(query);
      expect(collection.$query()).to.equal(query);
      expect(ref.limitToLast).to.have.been.calledWith(5);
    });

    it('can apply a multi argument query', function () {
      Model.prototype.$firebase = {
        query: {
          startAt: [5, 'key']
        }
      };
      ref.startAt = sinon.stub().returns(query);
      expect(collection.$query()).to.equal(query);
      expect(ref.startAt).to.have.been.calledWith(5, 'key');
    });

    it('can call a query function', function () {
      var queryFn = sinon.stub().returns(query);
      Model.prototype.$firebase = {
        query: queryFn
      };
      expect(collection.$query()).to.equal(query);
      expect(queryFn)
        .to.have.been.calledWith(ref)
        .and.calledOn(sinon.match.has('$$models', collection));
    });

  });

  describe('#$subscribe', function () {

    var ref;
    beforeEach(function () {
      ref = new Firebase();
      ref.set(null);
      sinon.stub(Collection.prototype, '$ref').returns(ref);
      collection.$subscribe();
    });

    it('handles new data', function () {
      ref.push({
        foo: 'bar'
      });
      ref.flush();
      $rootScope.$digest();
      expect(collection).to.have.length(1);
      expect(collection[0]).to.contain({
        foo: 'bar'
      });
    });

    it('updates data when changed', function () {
      var child = ref.push({
        foo: 'bar'
      });
      ref.flush();
      child.update({
        bar: 'baz'
      });
      ref.flush();
      $rootScope.$digest();
      expect(collection[0]).to.contain({
        foo: 'bar',
        bar: 'baz'
      });
    });

    it('removes data when removed', function () {
      var children = [
        ref.push({
          foo: 'bar'
        }),
        ref.push({
          bar: 'baz'
        })
      ];
      ref.flush();
      children[0].remove();
      ref.flush();
      $rootScope.$digest();
      expect(collection).to.have.length(1);
      expect(collection[0]).to.contain({
        bar: 'baz'
      });
    });

    it('updates the indicies when data is removed', function () {
      var children = [
        ref.push({
          foo: 'bar'
        }),
        ref.push({
          bar: 'baz'
        })
      ];
      children[0].remove();
      children[1].update({
        index: 'updated'
      });
      ref.flush();
      $rootScope.$digest();
      expect(collection[0]).to.contain({
        index: 'updated'
      });
    });
    
  });

};
