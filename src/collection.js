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
    ref.on('child_removed', function (snapshot) {
      this.$splice(snapshot.name());
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

module.exports.$inject = ['$delegate', 'Firebase'];
