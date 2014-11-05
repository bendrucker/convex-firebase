'use strict';

module.exports = function (ConvexModel, Firebase, convexConfig) {
  ConvexModel.prototype.$ref = function () {
    return new Firebase(convexConfig.firebase + this.$firebase.path.call(this));
  };
  return ConvexModel;
};

module.exports.$inject = ['$delegate', 'Firebase', 'convexConfig'];
