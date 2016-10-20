'use strict';

APP.factory('loading', [function(){
  function Loading(){
    this.element = null;
  }

  Loading.prototype.getInstance = function (dom) {
    this.element = document.querySelector(dom);
    return this;
  };

  Loading.prototype.start = function () {
    this.element.style.display = 'block';
  };

  Loading.prototype.complete = function () {
    this.element.style.display = 'none';
  };

  return new Loading;
}]);
