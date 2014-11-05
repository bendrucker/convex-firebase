'use strict';

module.exports = function () {

  beforeEach(angular.mock.module(function ($provide) {
    $provide.value('Firebase', require('mockfirebase').MockFirebase);
  }));

  var Firebase, $timeout, Model, model, collection;
  beforeEach(angular.mock.inject(function ($injector) {
    Firebase = $injector.get('Firebase');
    $timeout = $injector.get('$timeout');

    var ConvexModel = $injector.get('ConvexModel');
    var ConvexCollection = $injector.get('ConvexCollection');
    Model = ConvexModel.extend({
      $name: 'user'
    });
    model = new Model();
    collection = new ConvexCollection(Model);
  }));

  describe('#$ref', function () {

    it('can get a reference from its parent model', function () {
      collection.$relate('user', model);
      expect(collection.$ref().currentPath).to.equal('Mock://users');
    }); 

  });

};
