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
    let data = this.communicator.sendSync('state:get', {
      key,
      def,
    });
    data = State.deObject(data);
    if (typeof keys == 'string') keys = [keys];
    return keys.length === 0 ? data : _.pick(data, keys);
  }

  set(key, val, isSync = false) {
    if (typeof val !== 'string') val = JSON.stringify(val);
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
      if (okey === key) cb(State.deObject(arg[key]), State.deObject(old[key]));
    });
  }

  removes(values) {
    values.forEach(key => this.remove(key));
  }

  remove(key) {
    let data = this.communicator.sendSync('state:remove', {
      key,
    });
  }

  static deObject(string) {
    let decode = string;
    if (string && string.match(/^\{\".*\}$|^\[.+\]$/)) {
      try {
        decode = JSON.parse(string);
      } catch (e) {}
    }
    return decode;
  }
}

module.exports = State;