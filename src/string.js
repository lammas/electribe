'use strict';

class ESXString {
	constructor(value) {
		this.value = value.toString();
	}

	serialize() {
		return new Buffer(this.value, 'binary');
	}
}

module.exports = ESXString;
