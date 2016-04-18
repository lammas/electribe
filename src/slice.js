'use strict';

var Format = require('bin-format');
var Const = require('./constants');

var Slice = new Format()
	.buffer('values', Const.CHUNKSIZE_SLICE_DATA);

module.exports = Slice;
