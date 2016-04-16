'use strict';

var Format = require('bin-format');

function enumerate(values) {
	var C = class {
		constructor(value) {
			if (!this.isValid(value))
				throw new Error('Invalid value: ' + value + ' (' + typeof(value) + ')');
			this._value = value;
		}

		serialize() {
			return this._value;
		}

		isValid(value) {
			if (C.values.indexOf(value) == -1)
				return false;
			return true;
		}

		toString() {
			if (this._value === null)
				return "null";
			var idx = C.values.indexOf(this._value);
			if (idx == -1)
				return "invalid";
			return C.names[idx];
		}
	};

	C.names = [];
	C.values = [];
	for (var name in values) {
		C[name] = values[name];
		C.values.push(values[name]);
		C.names.push(name);
	}

	return C;
}


function enum_uint8(values) {
	return new Format()
		.uint8('value', enumerate(values));
}

module.exports = {
	enumerate: enumerate,
	uint8: enum_uint8
};
