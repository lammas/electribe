'use strict';

// based on http://skratchdot.com/projects/open-electribe-editor/javadocs/index.html?com/skratchdot/electribe/model/esx/EsxFile.html

var fs = require('fs');
var Format = require('bin-format');
var Enum = require('./src/enumparser');


function unpackInt(packedInt, numBits, numShiftedLeft) {
	var bitsUnshifted = Math.pow(2, numBits) - 1;
	var bitsShifted = bitsUnshifted << numShiftedLeft;
	var outputValue = packedInt & bitsShifted;
	return outputValue >> numShiftedLeft;
}

var EnabledFlag = Enum.uint8({
	DISABLED: 0,
	ENABLED: 1
});

var ArpeggiatorControl = Enum.uint8({
	NORMAL: 0,
	REVERSE: 1
});

var AudioInMode = Enum.uint8({
	MONO: 0,
	STEREO: 1
});

var MidiClock = Enum.uint8({
	INT: 0,
	EXT: 1,
	AUTO: 2
});

var PitchBendRange = Enum.uint8({
	BEND_NEG12: 0,
	BEND_NEG11: 1,
	BEND_NEG10: 2,
	BEND_NEG9:  3,
	BEND_NEG8:  4,
	BEND_NEG7:  5,
	BEND_NEG6:  6,
	BEND_NEG5:  7,
	BEND_NEG4:  8,
	BEND_NEG3:  9,
	BEND_NEG2:  10,
	BEND_NEG1:  11,
	BEND_NONE:  12,
	BEND_POS1:  13,
	BEND_POS2:  14,
	BEND_POS3:  15,
	BEND_POS4:  16,
	BEND_POS5:  17,
	BEND_POS6:  18,
	BEND_POS7:  19,
	BEND_POS8:  20,
	BEND_POS9:  21,
	BEND_POS10:  22,
	BEND_POS11:  23,
	BEND_POS12:  24
});


class GlobalParametersFlags {
	constructor(data) {
		this._value = data;
		this.noteMessageEnabled = unpackInt(data, 1, 0);
		this.systemExEnabled = unpackInt(data, 1, 1);
		this.controlChangeEnabled = unpackInt(data, 1, 2);
		this.programChangeEnabled = unpackInt(data, 1, 3);
		this._reserved = unpackInt(data, 4, 4);
	}

	serialize() {
		return this._value;
	}
}

var GlobalParametersFlagsFormat = new Format()
	.uint8('value', GlobalParametersFlags);


var GlobalParameters = new Format()
	.nest('memoryProtectEnabled', EnabledFlag)
	.uint8('_unknownByte0')
	.nest('arpeggiatorControl', ArpeggiatorControl)
	.nest('audioInMode', AudioInMode)
	.nest('midiClock', MidiClock)
	.nest('bitflags', GlobalParametersFlagsFormat)
	.nest('pitchBendRange', PitchBendRange)

	// .array('midiChannels', {
	// 	type: 'uint8',
	// 	length: 3
	// })
	// .array('partNoteNumbers', {
	// 	type: 'uint8',
	// 	length: 13
	// })
	// .array('midiControlChangeAssignments', {
	// 	type: 'uint8',
	// 	length: 33
	// })
	// .uint8('_unknownByte1')
	// .uint8('_unknownByte1')
	// .uint8('_unknownByte1')
	// .uint8('_unknownByte1')
	// .skip(179 + 3)
	;


var ESXFile = new Format()
	.buffer('header', 32)
	//.buffer('global', 192)
	.nest('global', GlobalParameters)
/*
	.buffer('unknown0', 288) // unknown
	.buffer('patterns', 256 * 4280)
	.buffer('unknown1', 148992)
	.buffer('songs', 64 * 528)
	.buffer('songevents', 20000 * 8)
	.buffer('unknown2', 330496)
	.buffer('bpsheader', 32)
	.uint32BE('numMonoSamples')
	.uint32BE('numStereoSamples')
	.uint32BE('currentSampleOffset')
	.buffer('unknown3', 212)
	.buffer('monoSampleHeaders', 256 * 40)
	.buffer('stereoSampleHeaders', 128 * 44)
	.buffer('unknown4', 768)
	.buffer('slices', 256 * 2048)
*/
	.buffer('sampledata', 'eof');


// var TESTFILE = '../ESX-Factory-Data.esx';
var TESTFILE = '../saved.esx';
fs.readFile(TESTFILE, function(err, buffer) {
	if (err)
		throw err;
	console.log('Got data');
	var result = ESXFile.parse(buffer);
	console.log('Parsing complete:');
	console.log(require('util').inspect(result, { depth: null }));
});




