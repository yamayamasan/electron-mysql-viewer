'use strict';
APP.controller('LeftSideCtrl', ['$scope', '$location', 'mysql','localDB', 'session', 'share', 'ngProgressFactory', 'notification', 'shortcut', 
  function($scope, $location, mysql, localDB, session, share, ngProgressFactory, notification,  shortcut){
    const progressbar = ngProgressFactory.createInstance();

    let connection = null;
    let isProcesslist = null;

    $scope.init = function() {
      share.watch('connections', (n) => {
        $scope.connections = n;
      });

      share.watch('tables', (n) => {
        if (!n || n.length <= 0) return;
        $scope.tables = _.map(n, (v) => {
          return _.values(v)[0];
        });
      });

      const _connection = session.getConnection();
      if (connection !== _connection) {
        isProcesslist = true;
      } else {
        isProcesslist = null;
      }
    };

    $scope.processlist = function() {
      if (isProcesslist) {
        $location.path(`/processlist`);
      }
    };

    $scope.onClickTable = function(table) {
      share.set('query_table', table);
    };

    $scope._processlist = function(values) {
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
          session.setData('threadId', connection.threadId);
          $scope.$apply(() => {
            progressbar.complete();
            shortcut.unbind();
            $location.path(`/processlist/${values.id}`);
          });
        });
      }).catch((e) => {
        console.error('faild connected');
        progressbar.complete();
        notification.error(e.msg);
      });      
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
          session.setData('threadId', connection.threadId);
          $scope.$apply(() => {
            progressbar.complete();
            shortcut.unbind();
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