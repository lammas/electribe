var util = require('util');

function inspect(o) {
	console.log(util.inspect(o, { depth: null }));
}

function uintToBits(n, numBits) {
	var a = [];
	for (var i=numBits-1; i>=0; i--) {
		a.push((n & (1 << i)) > 0 ? 1 : 0);
	}
	return a;
}

function uintFromBits(bitArray) {
	var n = 0;
	for (var i=0; i<bitArray.length; i++) {
		if (bitArray[i] == 0)
			continue;
		n |= (1 << (bitArray.length - 1 - i));
	}
	return n;
}

module.exports = {
	inspect: inspect,
	uintToBits: uintToBits,
	uintFromBits: uintFromBits,

	uint8TestPattern: [1, 0, 1, 0, 1, 0, 1, 0],
	uint16TestPattern: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
};
