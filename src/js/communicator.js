class Communicator {

  constructor() {
    const {
      ipcRenderer
    } = require('electron');
    this.communicator = ipcRenderer;
  }

  sendSync(label, object) {
    return this.communicator.sendSync(label, object);
  }

  send(label, object) {
    this.communicator.send(label, object);
  }

  on(eventName, cb, isOnce = false) {
    if (!isOnce) {
      this.communicator.on(eventName, cb);
    } else {
      this.communicator.once(eventName, cb);
    }
  }

  once(eventName, cb) {
    this.communicator.on(eventName, cb);
  }
}

module.exports = Communicator;