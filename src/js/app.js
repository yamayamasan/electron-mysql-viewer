const JS_DIR = `${__dirname}/js/`;

const Indexeddb = require(`${JS_DIR}/indexeddb`);
const MysqlClient = require(`${JS_DIR}/mysql_client`);
const View = require(`${JS_DIR}/view`);
const State = require(`${JS_DIR}/state`);
const Communicator = require(`${JS_DIR}/communicator`);
const Csv = require(`${JS_DIR}/csv`);
const Scl = require(`${JS_DIR}/scl`);
const Binary = require(`${JS_DIR}/binary`);
const Helper = require(`${JS_DIR}/helper`);

const communicator = new Communicator();
const state = new State(communicator);
const idxdb = new Indexeddb('mysql');
const helper = new Helper();

const schema = require(`${__dirname}/schemas/schemas.1.json`);
idxdb.init([schema]);

const mysql = new MysqlClient();

state.observe('push:toast', (obj) => {
  riot.mount('toast', obj);
});