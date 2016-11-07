'use strict';
APP.controller('OperationCtrl', ['$scope', 'mysql', 'share','session', 'notification', 'loading','localDB', 'export', 'shortcut', 'editor',
  function($scope, mysql, share, session, notification, loading, localDB, exportFile, shortcut, editor){
    const SPLIT_THRESHOLD = 300;
    const loadingbar = loading.getInstance('#circle-lodaer');

    let connection = null;
    let connection_id = null;
    let localData = null;
    let isAutoReload = false;
    let loop = null;
    let masterRowDatas = null;
    let sortState ={};
    let tables = null;

    // star mode
    $scope.star = {};
    $scope.star_set_query = null;
    $scope.starMode = false;
    
    // test
    $scope.editables = [];
    $scope.SPLIT_THRESHOLD = SPLIT_THRESHOLD;

    $scope.connectionName = null;
    $scope.rows = null;
    $scope.columns = [];
    $scope.localQueryTime = null;
    $scope.total_query_count = null;
    $scope.exec_query = null;
    $scope.seletedLimit = {
      label: 'limit 10000',
      value: 10000
    };
    $scope.limiters = [
      {label: 'limit 100', value: 100},
      {label: 'limit 500', value: 500},
      {label: 'limit 1000', value: 1000},
      {label: 'limit 5000', value: 5000},
      {label: 'limit 10000', value: 10000},
      {label: 'limit 50000', value: 50000}
    ];


    $scope.init = function() {
      connection = session.getConnection();
      if (!connection) {
        notification.error('Faild Connect');
        return false;
      }
      notification.success('Successed Connect');
      
      mysql.getTables(connection).then((rows) => {
        tables = rows;
        share.set('tables', tables);
      });

      shortcut.initialize('sample');
      shortcut.keyDown('Ctrl+Enter', () => {
        exec();
      }, 'sample');
    };

    $scope.aceLoaded = function(_editor) {
      co(function *(){
        connection_id = session.getData('connection_id');
        localData = yield localDB.getByKey('query', 'connection_id', connection_id);
        editor.initialize(_editor);
        if (!_.isUndefined(localData)) {
          editor.setValue(localData.text, -1);
        }
        assignViewData({
          connectionName: session.getData('connection_name')
        });
      });
    };

    $scope.exec = function() {
      exec();
    };

    $scope.sort = function(col) {
      setSortState(col);
      const sortedRows = _.orderBy(masterRowDatas, col, sortState[col]);
      page.reset();
      assignViewData({
        rows: currentRows(sortedRows, 'next')
      });
    };

    $scope.page = function(fnc) {
      return page.call(fnc);
    };

    // view actions
    $scope.downloadCsv = function() {
      if (!masterRowDatas) {
        notification.error('Download Error');
        return;
      }
      exportFile.exportCsv($scope.columns, masterRowDatas);
    };

    $scope.autoReload = function(active) {
      if (active !== isAutoReload) {
        isAutoReload = active;
      }
      if (isAutoReload) {
        loop = setInterval(() => {
          $scope.exec($scope.exec_query);
        }, 10000);
      } else {
        clearInterval(loop);
        loop = null;
      }
    };

    $scope.toggleWhereModal = function() {
      if (!$scope.star.table) {
        notification.error('select table');
        return;
      }
      co(function *() {
        const table = yield mysql.descTable(connection, $scope.star.table);
        $scope.$apply(() => {
          $scope.whereDatas = table;
          $('#star-where').modal('show');
        });
      });
    };

    $scope.selectedLimit = function(val) {
      $scope.limiters.forEach((limit) => {
        if (limit.value === val) {
          $scope.seletedLimit = limit;   
        }
      });
    };

    $scope.loadNextPage = function() {
      loadPage();
    };

    // $scope.seletedLimit = {
    //   label: 'limit 10000',
    //   value: 10000
    // };
    // $scope.limiters = [
    //   {label: 'limit 100', value: 100},
    //   {label: 'limit 500', value: 500},
    //   {label: 'limit 1000', value: 1000},
    //   {label: 'limit 5000', value: 5000},
    //   {label: 'limit 10000', value: 10000},
    //   {label: 'limit 50000', value: 50000}
    // ];
    // watcher
    $scope.$watch('rows', () => {
      page.loadingEnd();
    });

    $scope.$watch('starMode', (_star) => {
      $scope.star_set_query = null;
      if (_star) {
        $scope.tables = _.map(tables, (v) => {
          return _.values(v)[0];
        });
      }
    });

    // let _query_text = '{action} {columns} FROM {table} {where} {limit}';
    const _query_text = '{action} {columns} FROM {table} {limit}';
    const starOptions = {
      action: {
        1: 'select'
      },
      columns: {
        1: '*'
      }
    };

    $scope.$watch('star', (newData) => {
      // let c_query_text = _.clone(_query_text);
      let c_query_text = _query_text;
      const _datas = _.clone(newData);
      _.map(_datas, (data, idx) => {
        switch(idx) {
          case 'action':
          case 'columns':{
            _datas[idx] = starOptions[idx][data];
            break;
          }
          case 'limit':{
            _datas[idx] = `limit ${data}`;
            break;
          }
        }
        const reg = new RegExp(`{${idx}}`);
        if (reg.test(c_query_text)) {
          c_query_text = _.replace(c_query_text, `{${idx}}`, _datas[idx]);
        }

      });
      $scope.star_set_query = c_query_text;
    }, true);

    share.watch('query_table', (table) => {
      if (_.isEmpty(table)) return;
      const select_query = `SELECT * FROM ${table};`;
      editor.insertLastRow(select_query);
    });

    const exec = function() {
      load.start();
      let text = getQueryText();

      text = mysql.addLimiter(text, $scope.seletedLimit.value);
      co(function *() {
        const r = yield mysql.getQuery(connection, text);
        // const rows = r.rows;
        // const columns = getColumns(r.fields);
        masterRowDatas = r.rows;

        const splitRows = currentRows(masterRowDatas, 'next');
        assignViewData({
          rows: splitRows,
          columns: getColumns(r.fields),
          localQueryTime: r.localtime,
          total_query_count: masterRowDatas.length,
          exec_query: text
        });
        load.end();
      }).catch((err) => {
        load.end(err);
      });
    };

    const load = {
      start: () => {
        loadingbar.start();
        page.reset();
      },
      end: (err) => {
        if (err) {
          console.error(err);
          notification.error(err.msg);
        } else {
          cacheSQL(editor.getValue());
          setSortState();
        }
        loadingbar.complete();
      }
    };

    const page = {
      n: 0,
      active: false,
      reset: function(){
        this.n = 0;
      },
      increment: function(){
        this.n += 1;
      },
      decrement: function() {
        this.n -= 1;
      },
      isLoading: function(){
        return (this.active === true)? true : false;
      },
      LoadBegin: function(){
        this.active = true;
      },
      loadingEnd: function(){
        this.active = false;
      },
      load: function() {
        loadPage();
      },
      current: function() {
        return this.n;
      },
      next: function() {
        return this.n + 1;
      },
      prev: function() {
        return (this.n - 1 <= 0)? 0 : this.n - 1;
      },
      call: function(fnc) {
        if (typeof this[fnc] !== 'function') return false;
        return this[fnc]();
      }
    };

    const getColumns = function(fields) {
      const keys = [];
      _.forEach(fields, (field) => {
        keys.push(field.name);
      });
      return keys;
    };

    const currentRows = function(rows, func) {
      let _rows = rows;
      if (rows.length > SPLIT_THRESHOLD) {
        const start = page.current() * SPLIT_THRESHOLD;
        const end = page[func]() * SPLIT_THRESHOLD;
        _rows = _.slice(rows, start, end);
        page.increment();
      }
      return _rows;
    };

    const __currentRows = function(rows, func) {
      let _rows = rows;
      if (rows.length > SPLIT_THRESHOLD) {
        const start = page.current() * SPLIT_THRESHOLD;
        const end = page[func]() * SPLIT_THRESHOLD;
        _rows = _.slice(rows, start, end);
        page.increment();
      }
      return _rows;
    };

    const getQueryText = function(query) {
      if (query) return query;
      // if ($scope.star_set_query) return $scope.star_set_query;

      let text = editor.getCopyText();
      if (_.isEmpty(text)) {
        text = editor.getValue();
      }
      return text;
    };

    const cacheSQL = function(text) {
      if (_.isUndefined(localData)) {
        localDB.insert('query', {
          connection_id: connection_id,
          text: text
        });
      } else {
        if (localData.text != text) {
          localDB.update('query', localData.id, {
            text: text
          });
        }
      }
    };
    
  const loadPage = function() {
    if ($scope.total_query_count < SPLIT_THRESHOLD) return;
    const splitRows = currentRows(masterRowDatas, 'next');
    if (splitRows.length <= 0) return;
    _.map($scope.rows, (row) => {
      row.extend_info = {
        view: false
      };
    });
    assignViewData({
      rows: _.concat($scope.rows, splitRows)
    });
  };

  const setSortState = function(key) {
    $scope.columns.forEach((col) => {
      if (col != key) {
        sortState[col] = 'asc';
      }
    });
    if (sortState[key] === 'asc') {
      sortState[key] = 'desc';
    } else if (sortState[key] === 'desc') {
      sortState[key] = 'asc';
    }
  };

  const assignViewData = function(datas) {
    _.forEach(datas, (data, key) => {
      $scope[key] = data;
    });
    try {
      $scope.$apply();
    } catch(e) {
      console.error(e);
    }
  };

  /*
  const assignViewData = function(datas) {
    try {
      $scope.$apply(() => {
        _.forEach(datas, (data, key) => {
          $scope[key] = data;
        });
      });
    } catch(e) {
      console.error(e);
      _.forEach(datas, (data, key) => {
          $scope[key] = data;
      });
    }
  };
  */

}]);