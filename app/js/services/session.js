
'use strict';

APP.service('session', [function(){

  let openConnection = null;
  let datas = {};
  return {
    setData: function(key, val) {
      datas[key] = val;
    },
    getData: function(key) {
      return datas[key];
    },
    setConnection: function(connection) {
      openConnection = connection;
    },
    getConnection: function() {
      return openConnection;
    }
  };
}]);
