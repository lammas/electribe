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

module.exports = {
	unpackInt: unpackInt
};
