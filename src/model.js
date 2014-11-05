'use strict';

module.exports = function (ConvexModel, Firebase, $q, convexConfig) {
  ConvexModel.prototype.$ref = function () {
    return new Firebase(convexConfig.firebase)
      .child(this.$firebase.path.call(this));
  };
  ConvexModel.prototype.$subscribe = function (key, prefix) {
    var self = this;
    if (key) {
      if (!prefix) {
        prefix = '';
      }
      else {
        prefix = '$$';
      }
      var ref = this.$ref().child(key);
      return $q(function (resolve, reject) {
        ref.on('value', function (snapshot) {
          this[prefix + key] = snapshot.val();
        }, self);
        ref.once('value', function () {
          resolve(self);
        }, reject);
      });
    }
  };
  return ConvexModel;
};

module.exports.$inject = ['$delegate', 'Firebase', '$q', 'convexConfig'];
