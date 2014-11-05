'use strict';

module.exports = function (ConvexModel, Firebase, $q, convexConfig) {

  ConvexModel.prototype.$ref = function () {
    var pathOverride = this.$firebase && this.$firebase.path;
    return new Firebase(convexConfig.firebase)
      .child(pathOverride ? this.$firebase.path.call(this) : this.$path(this.id));
  };

  function toPromise (ref) {
    return $q(function (resolve, reject) {
      ref.once('value', resolve, reject);
    });
  }

  ConvexModel.prototype.$subscribe = function (keys, prefix) {
    var self = this;
    var refs;
    if (keys) {
      prefix = prefix ? '$$' : '';
      if (!Array.isArray(keys)) {
        keys = [keys]
      }
      var parent = this.$ref()
      refs = keys
        .map(function (key) {
          var ref = parent.child(key);
          ref.on('value', function (snapshot) {
            this[prefix + key] = snapshot.val();
          }, this);
          return ref;
        }, this);      
    }
    else {
      var ref = this.$ref();
      ref.on('value', function (snapshot) {
        this.$set(snapshot.val());
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

module.exports.$inject = ['$delegate', 'Firebase', '$q', 'convexConfig'];
