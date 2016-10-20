'use strict';

const mysql = require('mysql');
const tunnel = require('tunnel-ssh').tunnel;

APP.service('mysql', ['session', function(session){
  let timers = [];
  return {
    getConnection: function(info) {
      // if (info.type === 1) {
      //   return new Promise((resolve, reject) => {
      //     resolve(this.getDirectConnection(info.mysqlHost, info.mysqlUser, info.mysqlPassword, 
      //       info.mysqlDatabase, 3306));
      //   });
      // } else if (info.type === 2) {
        return this.getTunnelConnection(info);
      // }
    },
    getTunnelConnection: function(info) {
      const _this = this;
      return new Promise((resolve, reject) => {
        const tunnelPort = Math.round(Math.random() * 10000);
        const config = {
          host: info.sshHost,
          srcPort: tunnelPort,
          dstPort: info.sshPort,
          username: info.sshUsername,
          password: info.sshPassword
        };
        if (info.sshPrivatekey) {
          config.privateKey = require('fs').readFileSync(info.sshPrivatekey);
        }
        if (info.mysqlDisthost) {
          config.dstHost = info.mysqlDisthost;
        }
        timers.push(setTimeout(() => {
          reject({msg: 'Connection Timeout'});
        }, 6000));

        tunnel(config).then(() => {
          session.setData('connectionInfo', info);
          timers.map((timer) => {
            clearTimeout(timer);
          });
          timers = [];
          resolve(_this.getDirectConnection(info.mysqlHost, info.mysqlUser, info.mysqlPassword, 
            info.mysqlDatabase, tunnelPort));
        }).catch((err) => {
          console.error(err);
          reject(err);
        });
      });
    },
    getDirectConnection: function(host, user, password, database, port) {
      const connectionProps = {
        host,
        port,
        user,
        password
      };
      if (database) {
        connectionProps.database = database;
      }
      return mysql.createConnection(connectionProps);
    },
    reConnect: function() {
      co(function *(){
        const info = session.getData('connectionInfo');
        const connection = yield this.getConnection(info);
        connection.connect((err) => {
          if (err) {
            console.error(`error connecting: ${err.stack}`);
            return;
          }
          session.setConnection(connection);
          session.setData('connection_id', connection.id);
          session.setData('threadId', connection.threadId);
        });
      });
    },
    getDatabases: function(connection) {
      return new Promise((resolve, reject) => {
        if (!connection) reject();
        connection.query('show databases', (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
    },
    getTables: function(connection) {
      return new Promise((resolve, reject) => {
        if (!connection) reject();
        connection.query('SHOW TABLES', (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
    },
    getQuery: function(connection, sql) {
      return new Promise((resolve, reject) => {
        sql = this.fmtSql(sql);
        if (sql.match(/;/g).length == 1) {
          if (!connection || !sql) reject();
            const start = new Date();
            connection.query(sql, (err, rows, fields) => {
              const end = new Date();
              if (err) reject(err);
              resolve({
                rows, fields,
                localtime: moment(end).diff(start)
              });
            });
        } else {
          console.error('sql faild', sql);
          reject({msg: 'sql error'});
        }
      });
    },
    getProcessList: function(connection) {
      return this.getQuery(connection, 'show processlist;');
    },
    closeConnection: function(connection) {
      connection.end();
    },
    addLimiter: function(_sql, limit) {
      let sql = null;
      if (!_sql.match(/limit/)) {
        if (_.endsWith(_sql, ';')) {
          sql = _.replace(_sql, ';', ` limit ${limit};`);
        } else {
          sql = `${_sql} limit ${limit}`;  
        }
      }
      return !_.isNull(sql)? sql : _sql;
    },
    fmtSql: function(_sql) {
      _sql = _.trim(_sql);
      if (!_.endsWith(_sql, ';')) {
        return `${_sql};`;
      }
      return _sql;
    }
  };
}]);
