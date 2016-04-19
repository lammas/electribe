'use strict';

class ESXString {
	constructor(data) {
		this.data = data;
		this.value = data.toString();
	}

	serialize() {
		return this.data;
	}
}

module.exports = ESXString;
