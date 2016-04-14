'use strict';

var Format = require('bin-format');
var enumerate = require('./enum');

function enum_uint8(values) {
	return new Format()
		.uint8('value', enumerate(values));
}

module.exports = {
	uint8: enum_uint8
};
