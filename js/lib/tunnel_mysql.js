
/*
refs

https://github.com/felixge/node-mysql/issues/1029
https://github.com/Finanzchef24-GmbH/tunnel-ssh/blob/release/1.0.0/example/mysql.js
http://hideack.hatenablog.com/entry/2015/10/11/153159
*/
var mysql = require('mysql');
var Tunnel = require('tunnel-ssh');
var singleKey = 'mysql';

class TunnelMysql {
  //constructor(tunnelOpt, mysqlOpt) {
  constructor() {
    var tunnelOpt = {
      host: 'dev.gw.smartdrive.co.jp',
      username: 'sdadmin',
      privateKey:require('fs').readFileSync('/home/as-smt/.ssh/dev_keys/development_sdadmin'),
      dstHost: "smartdrive-development.cocecjwb95v3.ap-northeast-1.rds.amazonaws.com",
      dstPort: 3306,
    }

    var mysqlOpt = {
      host: 'smartdrive-development.cocecjwb95v3.ap-northeast-1.rds.amazonaws.com',
      port: 3306,
      database: "smartdrive_staging",
      user: "select_user",
      password: "aiGaevah0eo8",
      debug: true,
    }
    
    console.log('be');
    var server = Tunnel.tunnel(tunnelOpt, function(err, res) {
       console.log('a');
       var conn = mysql.createConnection(mysqlOpt);
       console.log(conn);
    });
  }
}
