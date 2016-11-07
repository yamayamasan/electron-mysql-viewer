'use strict';
APP.controller('ConnectionsCtrl', ['$scope', '$location', 'mysql', 'localDB', 'session', 'ngProgressFactory', 'notification', 'share', 
  function($scope, $location, mysql, localDB, session, ngProgressFactory, notification, share){
    const progressbar = ngProgressFactory.createInstance();

    $scope.init = function() {
      localDB.init();
      co (function *(){
        const connections = yield localDB.getAll('connections');
        $scope.$apply(() => {
          $scope.connections = connections;
          share.set('connections', connections);
        });
      });
    };

    $scope.edit = function(connectionId) {
      $location.path(`/connections/add/${connectionId}`);
    };

    $scope.connect = function(values){
      co(function *(){
        progressbar.start();

        const connection = yield mysql.getConnection(values);
        connection.connect((err) => {
          if (err) {
            console.error(`error connecting: ${err.stack}`);
            return;
          }
          session.setConnection(connection);
          session.setData('connection_id', values.id);
          session.setData('connection_name', values.name);
          session.setData('threadId', connection.threadId);
          $scope.$apply(() => {
            progressbar.complete();
            $location.path(`/operation/${values.id}`);
          });
        });
      }).catch((e) => {
        console.error('faild connected');
        progressbar.complete();
        notification.error(e.msg);
      });
    };
}]);