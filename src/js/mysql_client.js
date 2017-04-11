const mysql = require('mysql');
const tunnel = require('tunnel-ssh').tunnel;
const moment = require('moment');
const _ = require('lodash');
const Uuid = require('uuid');

class MysqlClient {

  constructor() {
    this.connections = {};
    this.active = null;
    this.threadId = null;
    this.queries = this.q = require('../constants/queries.json');
    this.default = {
      timeout: 60000,
    };
  }

  preConnection() {
    if (state.has('connection')) {
      const connection = state.get('connection');
      this.closeConnection(connection);
    }
  }

  getConnection(options) {
    this.preConnection();
    state.set('connection_options', options);
    const config = MysqlClient.setConfig(options);
    if (options.type === 1) {
      return new Promise((resolve) => {
        resolve(this.getConnectionDirect(config));
      });
    } else if (options.type === 2) {
      return this.getConnectionOverSsh(config);
    }
  }

  getConnectionOverSsh(config) {
    let timers = [];
    return new Promise((resolve, reject) => {
      // catchUncaughtException(reject);
      timers.push(setTimeout(() => {
        reject({ msg: 'Connection Timeout' });
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
  }

  getConnectionDirect(config) {
    const uuid = Uuid.v4();
    state.set('connectionInfo', config);
    state.set('con_uuid', uuid, true);
    this.active = uuid;
    this.connections[uuid] = mysql.createConnection(config.mysql);
    return this.connections[uuid];
  }

  openConnection(uuid, cb) {
    return new Promise((resolve, reject) => {
      this.connections[uuid].connect((err) => {
        if (err) return reject(false);
        this.threadId = this.connections[uuid].threadId;
        state.set('threadId', this.threadId);
        resolve(true);
      });
    });
  }

  processKill() {
    this.getProcesslist().then((processlist) => {
      // process check
      const query = this.q.kill_process.replace('%PID%', this.threadId);
      this.execQuery(query);
      setTimeout(async() => {
        await this.getConnection(state.get('connection_options'));
        this.openConnection(this.active);
      }, 2000);
    });
  }

  closeConnection(uuid = null) {
    uuid = uuid || this.active;
    let connection = this.connections[uuid];
    connection.end();
    delete this.connections[uuid];
    console.log('[close connection]', this.connections);
  }

  getProcesslist(uuid = null) {
    return this.execQuery(this.q.show_processlist, uuid);
  }

  getDatabases(uuid = null) {
    return this.execQuery(this.q.show_databases, uuid);
  }

  getTables(uuid = null) {
    return this.execQuery(this.q.show_tables, uuid);
  }

  descTable(table, uuid = null) {
    const query = this.q.desc_table.replace('%TABLE%', table);
    return this.execQuery(query, uuid);
  }

  execQuery(sql, uuid = null) {
    return new Promise(async(resolve, reject) => {
      uuid = uuid || this.active;
      let connection = this.connections[uuid];
      if (!connection) {
        await this.getConnection(state.get('connection_options'));
        this.openConnection(this.active);
        connection = this.connections[this.active];
      }
      sql = this.fmtSql(sql);
      if (sql.match(/;/g).length == 1) {
        if (!connection || !sql) reject(false);
        const start = new Date();
        connection.query(sql, (err, rows, fields) => {
          const end = new Date();
          if (err) reject(false);
          resolve({
            total: rows.length,
            rows,
            fields,
            localtime: moment(end).diff(start),
          });
        });
      } else {
        console.error('sql faild', sql);
        state.set('push:toast', { type: 'error', title: 'sql error' });
        reject(false);
      }
    });
  }

  fmtSql(_sql) {
    _sql = _.trim(_sql);
    return (!_.endsWith(_sql, ';')) ? `${_sql};` : _sql;
  }

  getUuids() {
    return Object.keys(this.connections);
  }

  static setConfig(options) {
    const config = {
      tunnel: {},
      mysql: {},
    }
    config.mysql = Object.assign(config.mysql, options.mysql);
    if (options.type === 2) {
      const tunnelPort = Math.round(Math.random() * 10000);
      config.mysql.port = tunnelPort;
      config.tunnel = {
        host: options.ssh.host,
        srcPort: tunnelPort,
        dstPort: options.mysql.port,
        username: options.ssh.user,
        password: options.ssh.password
      };
      if (options.ssh.privateKey) {
        config.tunnel.privateKey = require('fs').readFileSync(options.ssh.privateKey);
      }
      if (options.ssh.disthost) {
        config.tunnel.dstHost = options.ssh.disthost;
      }
    }

    return config;
  }
}

module.exports = MysqlClient;