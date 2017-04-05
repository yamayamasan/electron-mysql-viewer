const _ = require('lodash');

class State {
  constructor(communicator) {
    this.communicator = communicator;
    this.local = {
      data: {},
      has: this.hasLocal,
      get: this.getLocal,
      set: this.setLocal,
      remove: this.removeLocal,
    };
  }

  initialize(values) {
    this.communicator.send('state:init', values);
  }

  hasLocal(key) {
    return _.has(this.data, key);
  }

  getLocal(key) {
    return _.get(this.data, key);
  }

  setLocal(key, val) {
    _.set(this.data, key, val);
  }

  removeLocal(key) {
    const d = _.omit(this.data, key);
    this.data = d;
  }

  has(key) {
    return this.communicator.sendSync('state:has', { key });
  }

  get(key, keys = [], def = null) {
    const data = this.communicator.sendSync('state:get', {
      key,
      def,
    });
    if (typeof keys == 'string') keys = [keys];
    return keys.length === 0 ? data : _.pick(data, keys);
  }

  set(key, val, isSync = false) {
    if (isSync) {
      return this.communicator.sendSync('state:set.sync', {
        [key]: val,
      });
    }
    this.communicator.send('state:set', {
      [key]: val,
    });
  }

  sets(values) {
    _.forEach(values, (val, key) => {
      this.set(key, val);
    });
  }

  observe(key, cb) {
    this.communicator.on('state:set:res', (event, arg, old) => {
      const okey = Object.keys(arg)[0];
      if (okey === key) cb(arg[key], old[key]);
    });
  }
}

module.exports = State;