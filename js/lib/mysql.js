var mysql = require('mysql');
var singleKey = 'mysql';

// promise ver
class Mysql {
  constructor(_options, isTest) {
    if (hasSingleObject(singleKey)) {
      this.connection = getSingleObject(singleKey);
      return this;
    }

    this.createConnection(this.setOptions(_options));

    try {
      this.connect(this.connection);
      if (!isTest) setSingleObject(singleKey, this.connection);
    } catch(e) {
      console.error(e);
    }
  }

  connect(connection) {
    Promise.resolve(connection.connect(function(err) {
      if (err) {
        throw new Error('Connection Error');
      }

    }));
  }

  createConnection(options) {
      this.connection = mysql.createConnection(options);
  }

  destroy() {
    this.connection.destroy();
  }

  getConnection() {
    return this.connection;
  }

  setOptions(_options) {
    var options = {
      host: _options.host,
      user: _options.user,
      password: _options.password,
      database: _options.db
    };
    return options;
  }
}


/*
class Mysql {
  constructor(_options, isTest) {
    if (hasSingleObject(singleKey)) {
      this.connection = getSingleObject(singleKey);
      return this;
    }

    this.createConnection(this.setOptions(_options));

    try {
      this.connect(this.connection);
      if (!isTest) setSingleObject(singleKey, this.connection);
    } catch(e) {
      console.error(e);
    }
  }

  connect(connection) {
    connection.connect(function(err) {
      if (err) {
        throw new Error('Connection Error');
      }

    });
  }

  createConnection(options) {
    this.connection = mysql.createConnection(options);
  }

  destroy() {
    this.connection.destroy();
  }

  getConnection() {
    return this.connection;
  }

  setOptions(_options) {
    var options = {
      host: _options.host,
      user: _options.user,
      password: _options.password,
      database: _options.db
    };
    return options;
  }
}
*/
