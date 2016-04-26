app.controller('StartCtrl', ['$scope', function ($s) {
  
  // label: name
  var formFields = {
    name: 'connectionName',
    host: 'host',
    user: 'user',
    password: 'password',
    database: 'db',
  };

  this.init = () => {
    this.fieldList = formFields;
    this.newConnection = false;
    var infos = LocalStorage.get('mysqlOptions');
    this.connectionList = infos;
    View.showStart();
  };

  this.toggleNewConnection = () => {
    this.newConnection = !this.newConnection;
  };

  this.dbTestConnect = (form) => {
    var mysql = new Mysql(form, true);

    var con = mysql.getConnection();

    mysql.destroy();
  };

  this.saveDbOptions = (key, form) => {
    var session = {};
    session[key] = form;

    LocalStorage.put('mysqlOptions', session);
  };

  this.dbConnection = (options) => {
    var mysql = new Mysql(options);

    View.showMain();
  };

  this.connectionItemDel = (key) => {
    LocalStorage.remove('mysqlOptions', key);
    var infos = LocalStorage.get('mysqlOptions');
    this.connectionList = infos;
  };
}]);

app.controller('MainCtrl', ['$scope', function ($s) {
  var editor;
  var queryModel;
  var connection;

  var self = this;
  self.queryLog = [];
  self.databases = {};
  self.columns = {};
  self.rows = {};

  // var skipDb = ['information_schema', ];

  var initDatas = () => {
    co(function* (){
      var dbs = yield queryModel.run('show databases');
      var databases = {};

      yield coEach(R.values(dbs.values), function* (v){
        var tables = yield queryModel.run('show tables from ' + v.Database);
        var key = tables.columns[0];

        databases[v.Database] = R.map((v) => {
          return v[key];
        }, R.values(tables.values));

      });
      $s.$apply(function() {
        self.databases = databases;
      });
    });
  };

  this.init = () => {
    editor = new EditorWrap();

    appEmitter.on('show-main', function(){
      connection = getSingleObject('mysql');
      queryModel = new QueryModel();
      initDatas();
    });
  };

  this.runQuery = (sql) => {
    if (!sql) sql = editor.getValue();

    co(function* (){
      var data = yield queryModel.run(sql);

      var isSuccess = !R.isNil(data);

      queryLog(sql, isSuccess);
      if (!isSuccess) return;

      $s.$apply(function() {
        self.columns = data.columns;
        self.rows = data.values;
      });
    });
  };

  this.openModel = (db,table) => {
     console.log(db, table);
     self.tableName = table;

     co(function* (){
       var columns = yield queryModel.run("DESCRIBE " + table);
       var infos = yield queryModel.run("show table status from " + db + " like '" + table + "'");

       console.log(infos);
      
       $s.$apply(function(){
         self.tableColumnsColumns = columns.columns;
         self.tableColumnsRows = columns.values;
       });

       $('#tableInfoModal').openModal();
     });
  }

  var queryLog = (sql, isSuccess) => {
    self.queryLog.push(sql);
  }

}]);
