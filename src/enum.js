'use strict';

function enumerate(values) {
	var C = class {
		constructor(value) {
			if (!this.isValid(value))
				throw new Error('Invalid value: ' + v + ' (' + typeof(v) + ')');
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

module.exports = enumerate;
