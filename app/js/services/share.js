'use strict';

APP.service('share', ["$rootScope", function($rootScope){
  // $rootScope.__localDatas = {};
  return {
    watch: function(key, cb) {
      $rootScope.$watch(`__${key}`, (n, o, scope) => {
        cb(n);
      });
    },
    set: function(key, vals) {
      $rootScope[`__${key}`] = vals;
      // $rootScope.__localDatas[key] = vals;
    },
    get: function(key) {
      return $rootScope.__localDatas[key];
    }
  };
}]);
