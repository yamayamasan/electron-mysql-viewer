const JS_DIR = `${__dirname}/js/`;

const Indexeddb = require(`${JS_DIR}/indexeddb`);
const MysqlClient = require(`${JS_DIR}/mysql_client`);
const View = require(`${JS_DIR}/view`);
const State = require(`${JS_DIR}/state`);
const Communicator = require(`${JS_DIR}/communicator`);

const communicator = new Communicator();
const state = new State(communicator);
const idxdb = new Indexeddb('mysql');

const schema = require(`${__dirname}/schemas/schemas.1.json`);
idxdb.init([schema]);

// const observe = riot.observable(this);

state.observe('push:toast', (obj) => {
  riot.mount('toast', obj);
});