'use strict';

var Format = require('bin-format');

var Const = require('./constants');
var Utils = require('./utils');
var Enum = require('./enumparser');

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
		this.noteMessageEnabled = Utils.unpackInt(data, 1, 0);
		this.systemExEnabled = Utils.unpackInt(data, 1, 1);
		this.controlChangeEnabled = Utils.unpackInt(data, 1, 2);
		this.programChangeEnabled = Utils.unpackInt(data, 1, 3);
		this._reserved = Utils.unpackInt(data, 4, 4);
	}

	serialize() {
		// TODO: pack values
		return this._value;
	}
}

var GlobalParametersFlagsFormat = new Format()
	.uint8('value', GlobalParametersFlags);


var MidiChannelTypeName = [
	'keyboard1',
	'keyboard2',
	'drum'
];
var MidiChannels = new Format();
for (var i=0; i<Const.NUM_MIDI_CHANNELS; i++) {
	var name = i<MidiChannelTypeName.length ? MidiChannelTypeName[i] : ('channel' + i)
	MidiChannels.uint8(name);
}


var PartNoteNumberName = [
	'Drum1',
	'Drum2',
	'Drum3',
	'Drum4',
	'Drum5',
	'Drum6a',
	'Drum6b',
	'Drum7a',
	'Drum7b',
	'Stretch1',
	'Stretch2',
	'Slice',
	'AudioIn'
];
var PartNoteNumbers = new Format();
for (var i=0; i<Const.NUM_PART_NOTE_NUMBERS; i++) {
	var name = i<PartNoteNumberName.length ? PartNoteNumberName[i] : ('part' + i)
	PartNoteNumbers.uint8(name);
}

var MidiControlChangeAssignment = [
	'MOD_SPEED',
	'MOD_DEPTH',
	'MOD_TYPE',
	'MOD_DEST',
	'MOD_BPMSYNC',
	'FILTER_CUTOFF',
	'FILTER_RESONANCE',
	'FILTER_EGINT',
	'FILTER_TYPE',
	'GLIDE',
	'PAN',
	'EG_TIME',
	'LEVEL',
	'START_POINT',
	'AMP_EG',
	'ROLL',
	'REVERSE',
	'EFFECT_SEND',
	'EFFECT_SELECT',
	'PART_MOTION_SEQ',
	'FX1_TYPE',
	'FX1_EDIT1',
	'FX1_EDIT2',
	'FX1_MOTION_SEQ',
	'FX2_TYPE',
	'FX2_EDIT1',
	'FX2_EDIT2',
	'FX2_MOTION_SEQ',
	'FX3_TYPE',
	'FX3_EDIT1',
	'FX3_EDIT2',
	'FX3_MOTION_SEQ',
	'FX_CHAIN',
];
var MidiControlChangeAssignments = new Format();
for (var i=0; i<Const.NUM_MIDI_CONTROL_CHANGE_ASSIGNMENTS; i++) {
	var name = i<MidiControlChangeAssignment.length ? MidiControlChangeAssignment[i] : ('assignment' + i)
	MidiControlChangeAssignments.uint8(name);
}


var PatternSetParameters = new Format();
for (var i=0; i<Const.NUM_PATTERN_SET_PARAMETERS; i++) {
	PatternSetParameters.uint8('pattern' + i);
}


var GlobalParameters = new Format()
	.nest('memoryProtectEnabled', EnabledFlag)
	.uint8('_unknownByte0')
	.nest('arpeggiatorControl', ArpeggiatorControl)
	.nest('audioInMode', AudioInMode)
	.nest('midiClock', MidiClock)
	.nest('bitflags', GlobalParametersFlagsFormat)
	.nest('pitchBendRange', PitchBendRange)
	.nest('midiChannels', MidiChannels)
	.nest('partNoteNumbers', PartNoteNumbers)
	.nest('midiControlChangeAssignments', MidiControlChangeAssignments)
	.uint8('_unknownByte1')
	.uint8('_unknownByte2')
	.uint8('_unknownByte3')
	.uint8('_unknownByte4')
	.uint8('_unknownByte5')
	.uint8('_unknownByte6')
	.uint8('_unknownByte7')
	.uint8('_unknownByte8')
	.nest('patternSetParameters', PatternSetParameters)
	// .skip(179 + 3)
	;

module.exports = GlobalParameters;
