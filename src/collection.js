'use strict';

var angular = require('angular');

module.exports = function (ConvexCollection, Firebase, $rootScope) {

  ConvexCollection.prototype.$ref = function () {
    var proto = this.$$model.prototype;
    var ref = proto.$ref(false, this);
    if (proto.$firebase && proto.$firebase.query) {
      var query = proto.$firebase.query;
      if (typeof query === 'function') {
        ref = query.call(this, ref);
      }
      else {
        Object.keys(query).forEach(function (method) {
          var args = Array.isArray(query[method]) ? query[method] : [query[method]];
          ref = ref[method].apply(ref, args);
        });
      }
    }
    return ref;
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
        this.$$index[snapshot.key()] = index;
      }, this);
    }, this);
    ref.on('child_changed', function (snapshot) {
      applyAsync(function () {
        var index = this.$$index[snapshot.key()];
        this.$$models[index].$set(snapshot.val());
      }, this);
    }, this);
    ref.on('child_removed', function (snapshot) {
      applyAsync(function () {
        this.$splice(snapshot.key());
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
