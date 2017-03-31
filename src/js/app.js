const JS_DIR = `${__dirname}/js/`;

const MysqlClient = require(`${JS_DIR}/mysql_client`);
const View = require(`${JS_DIR}/view`);
const State = require(`${JS_DIR}/state`);
const Communicator = require(`${JS_DIR}/communicator`);
const communicator = new Communicator();
const state = new State(communicator);