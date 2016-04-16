'use strict';

var Format = require('bin-format');
var Const = require('./constants');
var Common = require('./common');

var Value = new Format()
	.uint8('value', Common.MSBOff8);

var MotionParam = new Format()
	.uint16BE('operation', Common.MSBOff16BE)
	.list('values', Const.NUM_MOTION_OPERATIONS, Value)
	;

module.exports = MotionParam;
