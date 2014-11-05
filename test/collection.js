'use strict';

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

  var Firebase, $timeout, Collection, Model, model, collection;
  beforeEach(angular.mock.inject(function ($injector) {
    Firebase = $injector.get('Firebase');
    $timeout = $injector.get('$timeout');

    var ConvexModel = $injector.get('ConvexModel');
    Collection = $injector.get('ConvexCollection');
    Model = ConvexModel.extend({
      $name: 'user'
    });
    model = new Model();
    collection = new Collection(Model);
  }));

  describe('#$ref', function () {

    it('can get a reference from its parent model', function () {
      collection.$relate('user', model);
      expect(collection.$ref().currentPath).to.equal('Mock://users');
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
      expect(collection).to.have.length(1);
      expect(collection[0]).to.contain({
        foo: 'bar'
      });
    });
    
  });

};
