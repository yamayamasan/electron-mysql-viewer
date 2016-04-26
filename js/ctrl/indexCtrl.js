var R = require('ramda');

var saveDbOptions = () => {
  var valKeys = ['host', 'user', 'password', 'db']
  var options = Util.elementIdsKeyValue(valKeys);

  var name = document.getElementById('connectionName').value;

  var session = {};

  session[name] = options;
  LocalStorage.put('mysqlOptions', session);
}

var dbTestConnect = () => {
  //var stOpt = LocalStorage.get('mysqlOptions');
  var valKeys = ['host', 'user', 'password', 'db'];
  var options = Util.elementIdsKeyValue(valKeys);


  options = {
    host: "localhost",
    user: "root",
    password: "root",
    db: "puchihapi"
  };

  var mysql = new Mysql(options, true);

  mysql.getConnection();
  mysql.destroy();

  // after connection kill
};

var runQuery = () => {
  // @TODO after syuusei
  var editor = new EditorWrap();
  var sql = editor.getValue();
  console.log(sql);

  var con = getSingleObject('mysql');

  var lquery = new Query();
  var r = lquery.run(sql);

  console.log(r);

  con.query(sql, (err, res, field) => {
    if (err) console.error(err);
    console.log(res);

    console.log(field);
    var columns;
    var values;
    R.forEach((v) => {
      console.log(v);
      var keys = R.keys(v);
      columns = keys;
/*
      if (keys.length == 0) {
        columns = keys;
      }
*/
      values = R.values(v);

    }, res);

    console.log(columns);
    console.log(values);
  });
};

var viewMain = () => {
    var start = document.getElementById('start');
    var main = document.getElementById('main');

    start.style.display = 'none';
    main.style.display = 'block';
}

// sample code
var test01 = () => {
  var storage = LocalStorage.get('mysqlOptions');
  console.log(storage.test01);
  var options = storage.test01;
  var mysql = new Mysql(options);

  mysql.getConnection();
  viewMain();

}
