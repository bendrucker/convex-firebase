'use strict';

module.exports = function (ConvexCollection, Firebase) {

  ConvexCollection.prototype.$ref = function () {
    return this.$$parent.$ref(false);
  };

  ConvexCollection.prototype.$subscribe = function () {
    this.$$index = {};
    var ref = this.$ref();
    ref.on('child_added', function (snapshot) {
      var index = this.$$models.length;
      this.$push(snapshot.val());
      this.$$index[snapshot.name()] = index;
    }, this);
    ref.on('child_changed', function (snapshot) {
      var index = this.$$index[snapshot.name()];
      this.$$models[index].$set(snapshot.val());
    }, this);

  };

  return ConvexCollection;

};

module.exports.$inject = ['$delegate', 'Firebase'];
