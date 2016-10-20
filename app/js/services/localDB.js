'use strict';
const Dexie = require('dexie');

APP.service('localDB', function(){
  let db = {};
  const schemas = require(`${APP_CONFIG_PATH}/indexdb_schema.json`);
  
  const getNow = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
  };

  return {
    init: function() {
      db = new Dexie('app');
      _.forEach(schemas, (schema, tblname) => {
        this.stores(tblname, schema.version, schema.columns);
      });
    },
    stores: function(tblname, version, columns) {
      db.version(version).stores({
        [tblname]: columns.join(',')
      });
    },
    getAll: function(tblname) {
      return new Promise((resolve, reject) => {
        db[tblname].toArray().then((datas, err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(datas);
        });
      });
    },
    getById: function(tblname) {

    },
    getByKey: function(tblname, key, val) {
      return new Promise ((resolve, reject) => {
        db[tblname].where(key).equals(val).first().then((r) => {
          resolve(r);
        });
      });
    },
    insert: function(tblname, values) {
      values.created_at = getNow();
      db[tblname].add(values);
    },
    update: function(tblname, _id, values) {
      const id = parseInt(_id);
      values.updated_at = getNow();
      db[tblname].update(id, values);
    }
  };
});
