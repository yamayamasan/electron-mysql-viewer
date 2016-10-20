'use strict';
APP.controller('GraphicalCtrl', ['$scope', '$location', 'shortcut','mysql', 'localDB', 'session', 'ngProgressFactory', 'notification', 'echart', 
  function($scope, $location, shortcut, mysql, localDB, session, ngProgressFactory, notification, echart){
    const progressbar = ngProgressFactory.createInstance();

    let connection;
    let connection_id;
    let editor;

    let orgRows;

    $scope.init = function() {
      connection = session.getConnection();
    };

    $scope.aceLoaded = function(_editor) {
      co(function *(){
        connection_id = session.getData('connection_id');
        $scope.localTextData = yield localDB.getByKey('sqls', 'connection_id', connection_id);
        editor = _editor;
        if (!_.isUndefined($scope.localTextData)) {
          editor.setValue($scope.localTextData.text, -1);
        }
        shortcut.keyDown('Ctrl+Enter', () => {
          $scope.exec();
        });
      });
    };

    $scope.exec = function() {
      progressbar.start();
      let text = editor.getCopyText();
      if (_.isEmpty(text)) {
        text = editor.getValue();
      }

      text = mysql.addLimiter(text, $scope.seletedLimit);
      mysql.getQuery(connection, text).then((r) => {
        const rows = r.rows;

        orgRows = _.clone(rows);
        // $scope.rowDatas = rows;
        const columns = getColumns(r.fields);
        // const splitRows = rowSplit($scope.rowDatas);
        $scope.$apply(() => {
          $scope.localQueryTime = r.localtime;
          $scope.columns = columns;
          // $scope.rows = splitRows;
          $scope.rows = orgRows;
          $scope.total_query_count = orgRows.length;
          console.log(orgRows);
          // sample
          const xAxisData = _.columnToArray(orgRows, 'ts');
          const seriesData = _.columnToArray(orgRows, 'ycs');

          echart.bar('#bar_chart', {
            xAxis: [{
              // 横軸
              type: 'category',
              data: xAxisData
            }],
            series: [
              {
                name: 'drive_data',
                data: seriesData
              }
            ]
          });
          // $scope.exec_query = text;
          // cacheSQL(editor.getValue());
          // setSortState();
          progressbar.complete();
        });
      }).catch((err) => {
        notification.error(err.msg);
        progressbar.complete();
      });
    };


    const viewChart = function() {
      
      const mychart = echarts.init(document.getElementById('chart'));
          mychart.setOption({
            title: {
              text: 'title'
            },
            xAxis: [{
              // 横軸
              type: 'category',
              data: [1, 2, 3, 4]
            }],
            yAxis: [{
              type: 'value'
            }],
            series: [
              {
                "name": "a",
                "type": "bar",
                "data": [5,20,10,30,40]
              }
            ]
          });
      // require([
      //     'echarts',
      //     'echarts/chart/bar',
      //     'echarts/chart/line'
      //   ],
      //   (ec) => {
      //     const mychart = ec.init(document.getElementById('chart'));
      //     mychart.setOptions({
      //       series: [
      //         {
      //           "name": "a",
      //           "type": "bar",
      //           "data": [5,20,10,30,40]
      //         }
      //       ]
      //     });
      //   }
      // );
    };
    
    const getColumns = function(fields) {
      const keys = [];
      _.forEach(fields, (field) => {
        keys.push(field.name);
      });
      return keys;
    };
}]);