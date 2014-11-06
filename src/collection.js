'use strict';

var angular = require('angular');

module.exports = function (ConvexCollection, Firebase, $rootScope) {

  ConvexCollection.prototype.$ref = function () {
    return this.$$parent.$ref(false);
  };

  function applyAsync (callback, context) {
    $rootScope.$applyAsync(angular.bind(context, callback));
  }

  ConvexCollection.prototype.$subscribe = function () {
    this.$$index = {};
    var ref = this.$ref();
    ref.on('child_added', function (snapshot) {
      applyAsync(function () {
        var index = this.$$models.length;
        this.$push(snapshot.val());
        this.$$index[snapshot.name()] = index;
      }, this);
    }, this);
    ref.on('child_changed', function (snapshot) {
      applyAsync(function () {
        var index = this.$$index[snapshot.name()];
        this.$$models[index].$set(snapshot.val());
      }, this);
    }, this);
    ref.on('child_removed', function (snapshot) {
      applyAsync(function () {
        this.$splice(snapshot.name());
      }, this);
    }, this);

  };

  ConvexCollection.prototype.$splice = function (id) {
    var index = this.$$index[id];
    this.$$models.splice(index, 1);
    Object.keys(this.$$index)
      .filter(function (id) {
        return this.$$index[id] > index;
      }, this)
      .forEach(function (id) {
        this.$$index[id] += -1;
      }, this);
    this.$$index[id] = void 0;
  };

  return ConvexCollection;

};

module.exports.$inject = ['$delegate', 'Firebase', '$rootScope'];
