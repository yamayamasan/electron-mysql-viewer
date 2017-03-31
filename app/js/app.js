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


/**


var splitRow = {
  scroll: 0,
  scrollMax: 0,
  height: 0,
  _itemList: [],
  _startIdx: 0,
  _height: 20,
  _displayRowNum: 10,
  _targetDom: null,
  _listDom: null,
  init: function(options) {
  	this._itemList = options.itemlist;
  	this._targetDom = options.tgt;
  	this._listDom = options.list;
    this.scrollMax = (this._itemList.length - this._displayRowNum) * this._height;
    this.setView(this.getList());
    this.listStyle();
    this.onScroll();
  },
  onScroll: function() {
  	var _this = this;
    this._targetDom.addEventListener('scroll', function(e){
    	_this.scroll = e.target.scrollTop;
    	_this.setView(_this.getList());
    });
  },
  getList: function() {
    this._startIndex = parseInt(this.scroll / this._height, 10);
    return this._itemList.slice(this._startIndex, this._startIndex + this._displayRowNum);
  },
  setView: function(items) {
  		var lilist = document.querySelectorAll('li');
       for (var i = 0; i < lilist.length; i++) {
        lilist[i].parentNode.removeChild(lilist[i]);
			}
      console.log(items.length);
  		for (var i = this._startIndex; i < items.length; i++) {
	   		var li = document.createElement('li');
  	 		li.textContent = i;
   			this._listDom.appendChild(li);
			}
  },
  listStyle: function(){
  	this._listDom.style.paddingTop = this.scroll + 'px';
  	this._listDom.style.paddingBottom = (this.scrollMax - this.scroll) + 'px';

  }
};


// test
var ilist = [];
var ul = document.querySelector('#ul');
for (var i = 0; i < 10000; i++) {
   ilist.push(i);
}
var listItemHeight = 17;
var displayRowNum = 10;

splitRow.init({
	tgt: document.querySelector('#scroll'),
  list: document.querySelector('#ul'),
  itemlist: ilist
});

*/
