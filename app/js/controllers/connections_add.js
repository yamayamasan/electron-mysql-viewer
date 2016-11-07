'use strict';

APP.controller('ConnectionsAddCtrl', ['$scope', '$location','mysql','localDB', 'notification', '$routeParams', 
  function($scope, $location,mysql, localDB, notification, $routeParams){
    const columns = require(`${APP_CONFIG_PATH}/input_fields.json`).connections;

    const id = $routeParams.id || null;
    $scope.isNew = true;
    $scope.userInput = {
      mysqlDatabase: null
    };

    $scope.databases = null;
    $scope.init = function() {
      $scope.columns = columns;
      if (!_.isNull(id)) {
        co(function *() {
          const _data = yield localDB.getById('connections', id);
          $scope.$apply(() => {
            $scope.userInput = _data;
            $scope.isNew = false;
          });
        });
      }
    };

    $scope.onConnect = function() {
      getDatabases(allowParams());
    };

    $scope.onBack = function() {
      $location.path('/connections');
    };

    $scope.selectDb = function(db) {
      $scope.userInput.mysqlDatabase = db;
    };

    $scope.onSave = function() {
      localDB.insert('connections', allowParams());
      $scope.onBack();
    };

    $scope.onUpdate = function() {
      localDB.update('connections', id, allowParams());
      $scope.onBack();
    };

    $scope.onRemove = function() {
      localDB.delete('connections', id);
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

    const allowParams = function() {
      const params = {};
      _.forEach($scope.userInput, (val, key) => {
        if (!_.isUndefined(columns[key]) && (_.isUndefined(columns[key].type) || 
            columns[key].type === $scope.userInput.type)) {
          params[key] = val;
        }
      });
      return params;
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
