var app = angular.module('mysql', ['ui.router']);

function AppEmitter() {
  EventEmitter.call(this);
}
util.inherits(AppEmitter, EventEmitter);
const appEmitter = new AppEmitter();
