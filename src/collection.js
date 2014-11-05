'use strict';

module.exports = function (ConvexCollection, Firebase) {

  ConvexCollection.prototype.$ref = function () {
    return this.$$parent.$ref(false);
  };

  return ConvexCollection;

};

module.exports.$inject = ['$delegate', 'Firebase'];
