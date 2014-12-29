'use strict';

var angular = require('angular');

module.exports = function (ConvexModel, Firebase, $q, $rootScope, convexConfig) {

  ConvexModel.prototype.$ref = function (collection) {
    var pathOverride = this.$firebase && this.$firebase.path;
    return new Firebase(convexConfig.firebase)
      .child(pathOverride ? this.$firebase.path.call(this, collection) : this.$path(!collection));
  };

  function toPromise (ref) {
    return $q(function (resolve, reject) {
      ref.once('value', resolve, reject);
    });
  }

  function applyAsync (callback, context) {
    $rootScope.$applyAsync(angular.bind(context, callback));
  }

  ConvexModel.prototype.$subscribe = function (keys, prefix) {
    var self = this;
    var refs;
    if (keys) {
      prefix = prefix ? '$$' : '';
      if (!Array.isArray(keys)) {
        keys = [keys];
      }
      var parent = this.$ref();
      refs = keys
        .map(function (key) {
          var ref = parent.child(key);
          ref.on('value', function (snapshot) {
            applyAsync(function () {
              this[prefix + key] = snapshot.val();
            }, this);
          }, this);
          return ref;
        }, this);      
    }
    else {
      var ref = this.$ref();
      ref.on('value', function (snapshot) {
        applyAsync(function () {
          this.$set(snapshot.val());
        }, this);
      }, this);
      refs = [ref];
    }
    var promises = refs.map(function (ref) {
      return toPromise(ref);
    }, this);
    return $q.all(promises)
      .then(function () {
        return self;
      });
  };

  return ConvexModel;
};

module.exports.$inject = [
  '$delegate',
  'Firebase',
  '$q',
  '$rootScope',
  'convexConfig'
];
