'use strict';
APP.controller('ProcesslistCtrl', ['$scope', 'mysql', 'session', 'loading', '$rootScope', 
  function($scope, mysql, session, loadingbar, $rootScope){
    $scope.btnActive = false;

    const loading = loadingbar.getInstance('#circle-lodaer');
    
    let loop = null;

    $scope.init = function() {
      getProcesslist();
      setLoop();
    };

    $scope.autoReload = function(flag){
      if (flag) {
        setLoop();
      } else {
        clearLoop();
      }
    };
    
    $rootScope.$on('$locationChangeStart', (ev, next, cur) => {
      clearLoop();
    });

    const setLoop = function() {
      $scope.btnActive = true;
      loop = setInterval(() => {
        getProcesslist();
      }, 5000);
    };

    const clearLoop = function() {
      $scope.btnActive = false;
      clearInterval(loop);
      loop = null;
    };

    const getProcesslist = function() {
      co(function *() {
        loading.start();
        const processlist = yield mysql.getProcessList(session.getConnection());
        console.log(processlist);

        $scope.$apply(() => {
          $scope.columns = getColumns(processlist.fields);
          $scope.rows = processlist.rows;
          loading.complete();
        });
      });
    };
    
    const getColumns = function(fields) {
      const keys = [];
      _.forEach(fields, (field) => {
        keys.push(field.name);
      });
      return keys;
    };
}]);