'use strict';

module.exports = function (ConvexModel, Firebase, $q, convexConfig) {

  ConvexModel.prototype.$ref = function () {
    return new Firebase(convexConfig.firebase)
      .child(this.$firebase.path.call(this));
  };

  ConvexModel.prototype.$subscribe = function (key, prefix) {
    var self = this;
    var ref = this.$ref();
    if (key) {
      if (!prefix) {
        prefix = '';
      }
      else {
        prefix = '$$';
      }
      ref = ref.child(key);
      ref.on('value', function (snapshot) {
        this[prefix + key] = snapshot.val();
      }, this);
    }
    else {
      ref.on('value', function (snapshot) {
        this.$set(snapshot.val());
      }, this);
    }
    return $q(function (resolve, reject) {
      ref.once('value', function () {
        resolve(self);
      }, reject);
    });
  };

  return ConvexModel;
};

module.exports.$inject = ['$delegate', 'Firebase', '$q', 'convexConfig'];
