const Dexie = require('dexie');

class Indexeddb {

  constructor(dbname) {
    this.db = new Dexie(dbname);
    this.table = null;
  }

  init(dbschemas) {
    dbschemas.forEach((dbschema) => {
      const { version, tables } = this.parseSchema(dbschema.schema);
      this.db.version(version).stores(tables);
    });
    this.db.open();
  }

  d(tblname) {
    return this.db[tblname];
  }

  getById(tblname, id) {
    return new Promise((resolve) => {
      this.db[tblname].where('id').equals(id).first((data) => {
        resolve(data || null);
      });
    });
  }

  get(tblname, conditions) {
    return new Promise((resolve) => {
      // const key = Object.keys(conditions)[0];
      const [key] = Object.keys(conditions);
      this.db[tblname].where(key).equals(conditions[key]).first((data) => {
        resolve(data || null);
      });
    });
  }

  bulkPut(tblname, params) {
    return this.db[tblname].bulkPut(params);
  }

  add(tblname, params) {
    return this.db[tblname].add(params);
  }

  put(tblname, params) {
    return this.db[tblname].put(params);
  }

  all(tblname, index = null) {
    const all = this.db[tblname];
    if (index) {
      return all.toArray((values) => {
        const r = {};
        values.forEach((val) => {
          const key = val[index];
          r[key] = val;
        });
        return r;
      });
    }
    return all.toArray();
  }

  table(tblname) {
    return this.db[tblname];
  }

  parseSchema(schemas) {
    const response = {
      version: schemas.version,
      tables: {},
    };
    schemas.tables.forEach((schema) => {
      const table = schema.table;
      const columns = [];
      _.forEach(schema.columns, (opt, col) => {
        let key = col;
        if (opt !== null) key = `${opt}${col}`;
        columns.push(key);
      });
      response.tables[table] = columns.join(',');
    });
    return response;
  }
}

module.exports = Indexeddb;