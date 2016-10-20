'use strict';

APP.controller('ConnectionsAddCtrl', ['$scope', '$location','mysql','localDB', 'notification',
  function($scope, $location,mysql, localDB, notification){
    const columns = require(`${APP_CONFIG_PATH}/input_fields.json`).connections;

    $scope.userInput = {
      mysqlDatabase: null
    };
    
    $scope.databases = {};
    $scope.init = function() {
      $scope.columns = columns;
    };

    $scope.onConnect = function() {
      getDatabases($scope.userInput);
    };

    $scope.onBack = function() {
      $location.path('/connections');
    };

    $scope.selectDb = function(db) {
      $scope.userInput.mysqlDatabase = db;
      console.log(db);
    };

    $scope.onSave = function() {
      localDB.insert('connections', $scope.userInput);
      $scope.onBack();
    };

    $scope.isShow = function(key, col) {
      if (key === 'type') return true;
      if (key === 'mysqlHost') {
        col.disable = ($scope.userInput.type === 1)? false : true;
      }
      if ((_.isUndefined(col.type)) || ($scope.userInput.type === col.type)) return true;

      return false;
    };

    const getDatabases = function(input) {
      co(function *(){
        const connection = yield mysql.getConnection(input);
        connection.connect();

        const results = yield mysql.getDatabases(connection);
        $scope.$apply(() => {
          $scope.databases = results;
        });
        results.forEach((row) => {
          console.info(row);
        });
        mysql.closeConnection(connection);
      }).catch((err) => {
        console.error(err);
        notification.error(err);
      });
    };
}]);
