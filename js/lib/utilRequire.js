const R = require('ramda');
const $ = jQuery = require("./node_modules/jquery/jquery.min.js");
const Hammer = require("./node_modules/jquery/hammer.min.js");
const EventEmitter = require('events');
const util = require('util');
const co = require('co');
const coEach = require('co-each');
