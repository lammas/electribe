'use strict';

var Format = require('bin-format');

function mappedlist_uint8(names, length, fallbackPrefix) {
	fallbackPrefix = fallbackPrefix || 'unknown';
	var fmt = new Format();
	for (var i = 0; i < length; i++) {
		var name = i<names.length ? names[i] : (fallbackPrefix + i)
		fmt.uint8(name);
	}
	return fmt;
}

function mappedlist_format(names, length, format, fallbackPrefix) {
	fallbackPrefix = fallbackPrefix || 'unknown';
	var fmt = new Format();
	for (var i = 0; i < length; i++) {
		var name = i<names.length ? names[i] : (fallbackPrefix + i)
		fmt.nest(name, format);
	}
	return fmt;
}

module.exports = {
	format: mappedlist_format,
	uint8: mappedlist_uint8,
};
