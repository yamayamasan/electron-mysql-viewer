'use strict';

const mysql = require('mysql');
const tunnel = require('tunnel-ssh').tunnel;

const catchUncaughtException = function(reject) {
  process.on('uncaughtException', function(e){
    if (e && e.code === "EADDRINUSE") {
      console.error(e.message);
      reject(e);
    }
  });
};

APP.service('mysql', ['session', function(session){
  let timers = [];

  const setConfig = (info) => {
    const config = {
      tunnel: {},
      mysql: {}
    };
    let mysqlPort = info.mysqlPort;
    if (info.type === 2) {
      const tunnelPort = Math.round(Math.random() * 10000);
      mysqlPort = tunnelPort;

      config.tunnel = {
        host: info.sshHost,
        srcPort: tunnelPort,
        dstPort: info.mysqlPort,
        username: info.sshUsername,
        password: info.sshPassword
      };
      if (info.sshPrivatekey) {
        config.tunnel.privateKey = require('fs').readFileSync(info.sshPrivatekey);
      }
      if (info.mysqlDisthost) {
        config.tunnel.dstHost = info.mysqlDisthost;
      }
    }

    config.mysql = {
      host: info.mysqlHost,
      port: mysqlPort, 
      user: info.mysqlUser,
      password: info.mysqlPassword
    };
    if (info.mysqlDatabase) {
      config.mysql.database = info.mysqlDatabase;
    }

    return config;
  };

  return {
    preConnection: function() {
      if (session.hasConnection()) {
        const connection = session.getConnection();
        this.closeConnection(connection);
        session.clearConnection();
      }
    },
    getConnection: function(info) {
      this.preConnection();
      const config = setConfig(info, true);
      if (info.type === 1) {
        return new Promise((resolve, reject) => {
          resolve(this.getConnectionDirect(config));
        });
      } else if (info.type === 2) {
        return this.getConnectionOverSsh(config);
      }
    },
    getConnectionOverSsh: function(config) {
      return new Promise((resolve, reject) => {
        catchUncaughtException(reject);
        timers.push(setTimeout(() => {
          reject({msg: 'Connection Timeout'});
        }, 6000));

        tunnel(config.tunnel).then(() => {
          timers.map((timer) => {
            clearTimeout(timer);
          });
          timers = [];
          resolve(this.getConnectionDirect(config));
        }).catch((err) => {
          console.error(err);
          reject(err);
        });
      });
    },
    getConnectionDirect: function(config) {
      session.setData('connectionInfo', config);
      return mysql.createConnection(config.mysql);
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
    descTable: function(connection, table) {
      return new Promise((resolve, reject) => {
        if (!connection) reject();
        connection.query(`DESC ${table}`, (err, rows) => {
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
        _sql = _.trim(_sql);
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
