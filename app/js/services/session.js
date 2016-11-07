
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
    },
    clearConnection: function() {
      openConnection = null;
    },
    hasConnection: function() {
      if (_.isNull(openConnection)) {
        return false;
      }
      return true;
    }
  };
}]);
