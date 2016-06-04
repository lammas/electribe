'use strict';

function unpackInt(packedInt, numBits, numShiftedLeft) {
	var bitsUnshifted = Math.pow(2, numBits) - 1;
	var bitsShifted = bitsUnshifted << numShiftedLeft;
	var outputValue = packedInt & bitsShifted;
	return outputValue >> numShiftedLeft;
}

function packInt(packedInt, inputValue, numBits, numShiftedLeft) {
	var bitsUnshifted = Math.pow(2, numBits) - 1;
	var bitsShifted = bitsUnshifted << numShiftedLeft;
	var shiftedInputValue = inputValue << numShiftedLeft;
	packedInt = packedInt & (~bitsShifted);
	packedInt = packedInt | shiftedInputValue;
	return packedInt;
}

function mask(start, end) {
	var m = 0;
	for (var i = start; i <= end; i++)
		m |= 1 << i;
	return m;
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

function uintToBits(n, numBits) {
	var a = [];
	for (var i=numBits-1; i>=0; i--) {
		a.push((n & (1 << i)) > 0 ? 1 : 0);
	}
	return a;
}

module.exports = {
	unpackInt: unpackInt,
	packInt: packInt,
	mask: mask,
	uintFromBits: uintFromBits,
	uintToBits: uintToBits
};
