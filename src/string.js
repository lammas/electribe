'use strict';

class ESXString {
	constructor(data) {
		this.data = data;
	}

	get value() {
		return this.data.toString();
	}

	set value(str) {
		var length = this.data.length;
		this.data = Buffer.alloc(length, str, 'ascii');
	}

	serialize() {
		return this.data;
	}
}

module.exports = ESXString;
