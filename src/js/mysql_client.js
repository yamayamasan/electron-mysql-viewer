const mysql = require('mysql');
const tunnel = require('tunnel-ssh').tunnel;

class MysqlClient {

  constructor() {

  }

  preConnection() {
    if (state.has('connection')) {
      const connection = state.get('connection');
      this.closeConnection(connection);
      // session.clearConnection();
    }
  }

  getConnection(options) {
    this.preConnection();
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
    state.set('connectionInfo', config);
    return mysql.createConnection(config.mysql);
  }

  closeConnection(connection) {
    connection.end();
  }

  static setConfig(options) {
    console.log('options', options);
    const config = {
      tunnel: {},
      mysql: {},
    }
    const mysql = Object.assign({}, _.omit(options.mysql, 'port'));
    config.mysql.port = options.mysql.port;
    // let mysqlPort = options.mysql.port;
    if (options.type === 2) {
      // 要修正
      const tunnelPort = Math.round(Math.random() * 10000);
      config.mysql.port = tunnelPort;

      config.tunnel.dstPort = config.mysql.port;
      config.tunnel.srcPort = tunnelPort;
      config.tunnel = Object.assign(config.tunnel, options.ssh);
      if (options.ssh.privateKey) {
        config.tunnel.privateKey = require('fs').readFileSync(options.ssh.privateKey);
      }
      if (options.ssh.disthost) {
        config.tunnel.dstHost = options.ssh.disthost;
      }
    }

    config.mysql = Object.assign(config.mysql, mysql);

    console.log('config', config);

    return config;
  }
}

module.exports = MysqlClient;