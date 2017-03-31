const _ = require('lodash');

class View {

  constructor(params, _this_, fireInit = true) {
    this.params = params;
    this.context = _this_;
    if (fireInit) this.init();
  }

  init() {
    this.context.vv = Object.assign({}, this.params);
    this.context.update();
  }

  get(key) {
    return _.get(this.context.vv, key);
  }

  set(key, val, fire = true) {
    _.set(this.context.vv, key, val);
    if (fire) {
      this.context.update();
    }
  }

  sets(values) {
    _.forEach(values, (val, key) => {
      this.set(key, val, false);
    });
    this.context.update();
  }

  restore(key, isUpdate = false) {
    this.context.vv[key] = this.params[key];
    if (isUpdate) this.context.update();
  }
}

module.exports = View;