'use strict';

var Format = require('bin-format');

class ESXString {
	constructor(value) {
		this.value = value.toString();
	}

	serialize() {
		return new Buffer(this.value, 'binary');
	}
}

var Pattern = new Format()
	.buffer('name', 8, ESXString)
	.uint16LE('tempo')
	.uint8('swing')
	;


module.exports = Pattern;
