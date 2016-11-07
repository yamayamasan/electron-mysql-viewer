const co = require('co');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const APP = angular.module('app', ['ngRoute', 'ui.ace', 'ngProgress' ]);
const APP_PATH  = __dirname;
const APP_CONFIG_PATH  = `${APP_PATH}/config`;

// extend lodash
(function(){
  this.column = (collection, keys) => {
    const r = [];
    collection.forEach((item) => {
      const _item = this.pick(item, keys);
      r.push(_item);
    });
    return r;
  };
  
  this.columnToArray = (collection, keys) => {
    let r = [];
    collection.forEach((item) => {
      const _item = this.pick(item, keys);
      r = r.concat(this.values(_item));
    });
    return r;
  };
  
}.call(_));

APP.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    redirectTo: 'connections'
  }).when('/connections', {
    templateUrl: 'views/connections.html',
    controller: 'ConnectionsCtrl'
  }).when('/connections/add', {
    templateUrl: 'views/connections_add.html',
    controller: 'ConnectionsAddCtrl'
  }).when('/connections/add/:id', {
    templateUrl: 'views/connections_add.html',
    controller: 'ConnectionsAddCtrl'
  }).when('/operation/:id', {
    templateUrl: 'views/operation.html',
    controller: 'OperationCtrl'
  }).when('/graphical', {
    templateUrl: 'views/graphical.html',
    controller: 'GraphicalCtrl'
  }).when('/processlist', {
    templateUrl: 'views/processlist.html',
    controller: 'ProcesslistCtrl'
  }).when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'SettingsCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});
