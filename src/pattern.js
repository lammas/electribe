'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');
var ESXString = require('./string');

var Beat = Enum.enumerate({
	BEAT_16TH: 0,
	BEAT_32ND: 1,
	BEAT_8TRI: 2,
	BEAT_16TRI:3
});

class PatternFlags {
	constructor(value) {
		this._value = value;
		this.patternLength = Utils.unpackInt(value, 3, 0); // 0-7 -> 1-8
		this._reserved = Utils.unpackInt(value, 1, 3);
		this.beat = new Beat(Utils.unpackInt(value, 2, 4));
		this.rollType = Utils.unpackInt(value, 2, 6);
	}

	serialize() {
		// TODO: pack value
		return this._value;
	}
}

class ArpFlags {
	constructor(value) {
		this._value = value;
		this.arpScale = Utils.unpackInt(value, 5, 0);
		this._reserved = Utils.unpackInt(value, 3, 5);
	}

	serialize() {
		// TODO: pack value
		return this._value;
	}
}

class Tempo {
	constructor(value) {
		this.value = value;
		var tempoWhole = Utils.unpackInt(value, 9, 7);
		var tempoDecimal = Utils.unpackInt(value, 4, 0);

		// valid tempoDecimal values are between 0-9
		if (tempoDecimal > 9 || tempoDecimal < 0)
			tempoDecimal = 0;

		// valid tempoWhole values are between 20-300
		if (tempoWhole < 20)
			tempoWhole = 20;
		if (tempoWhole > 300)
			tempoWhole = 300;

		this.tempo = parseFloat('' + tempoWhole + '.' + tempoDecimal);
	}

	serialize() {
		return this.value;
	}
}

var Swing = Enum.uint8({
	SWING_50: 0,
	SWING_51: 1,
	SWING_52: 2,
	SWING_53: 3,
	SWING_54: 4,
	SWING_55: 5,
	SWING_56: 6,
	SWING_57: 7,
	SWING_58: 8,
	SWING_59: 9,
	SWING_60: 10,
	SWING_61: 11,
	SWING_62: 12,
	SWING_63: 13,
	SWING_64: 14,
	SWING_65: 15,
	SWING_66: 16,
	SWING_67: 17,
	SWING_68: 18,
	SWING_69: 19,
	SWING_70: 20,
	SWING_71: 21,
	SWING_72: 22,
	SWING_73: 23,
	SWING_74: 24,
	SWING_75: 25,
});

class DrumFlags0 {
	constructor(value) {
		this.value = value;

		// TODO: enums
		this.FxSelect = Utils.unpackInt(value, 2, 0);
		this.FxSend = Utils.unpackInt(value, 1, 2);
		this.Roll = Utils.unpackInt(value, 1, 3);
		this.AmpEg = Utils.unpackInt(value, 1, 4);
		this.Reverse = Utils.unpackInt(value, 1, 5);
		this.ReservedBitsAfterReverse = Utils.unpackInt(value, 2, 6);
	}

	serialize() {
		// TODO: pack
		return this.value;
	}
}

class DrumFlags1 {
	constructor(value) {
		this.value = value;

		// TODO: enums
		this.ModDest = Utils.unpackInt(value, 3, 0);
		this.ReservedBitAfterModDepth = Utils.unpackInt(value, 1, 3);
		this.ModType = Utils.unpackInt(value, 3, 4);
		this.BpmSync = Utils.unpackInt(value, 1, 7);
	}

	serialize() {
		// TODO: pack
		return this.value;
	}
}

// Reference: TABLE23
class DrumSequenceSteps {
	constructor(data) {
		this.data = data;
		this.steps = [];
		for (var i = 7; i >= 0; i--) {
			this.steps.push( data & (1 << i) ? 1 : 0 );
		}
	}

	serialize() {
		return data;
	}
}

var DrumSequenceBar = new Format()
	.uint8('steps', DrumSequenceSteps);

var DrumPart = new Format()
	// .buffer('data', Const.CHUNKSIZE_PARTS_DRUM);
	.uint16BE('samplepointer')
	.uint8('slicenumber')

	// There is conflicting info on this in the "ESX1_Midi_Imp.txt" file
	// TABLE6 says "reserved", but TABLE1 infers byte2 and byte3 are
	// sliceNumber
	.uint8('_unknown0')
	.uint8('filtertype') // TODO: enum
	.uint8('cutoff')
	.uint8('resonance')
	.uint8('egint')
	.uint8('pitch')
	.uint8('level')
	.uint8('pan')
	.uint8('egtime')
	.uint8('startpoint')
	.uint8('flags0', DrumFlags0) // TODO: better name
	.uint8('flags1', DrumFlags1) // TODO: better name
	.uint8('modspeed')
	.uint8('moddepth')
	.uint8('motionseqstatus')
	.list('sequencedata', Const.NUM_SEQUENCE_DATA, DrumSequenceBar)
	;

var KeyboardParts = new Format()
	.buffer('data', Const.CHUNKSIZE_PARTS_KEYBOARD);

var StretchSliceParts = new Format()
	.buffer('data', Const.CHUNKSIZE_PARTS_STRETCHSLICE);

var AudioInParts = new Format()
	.buffer('data', Const.CHUNKSIZE_PARTS_AUDIOIN);

var AccentParts = new Format()
	.buffer('data', Const.CHUNKSIZE_PARTS_ACCENT);

var FXParam = new Format()
	.buffer('data', Const.CHUNKSIZE_PARAMETERS_FX);

var MotionParam = new Format()
	.buffer('data', Const.CHUNKSIZE_PARAMETERS_MOTION);

var PatternParts = new Format()
	.list('drum', Const.NUM_PARTS_DRUM, DrumPart)
	.list('keyboard', Const.NUM_PARTS_KEYBOARD, KeyboardParts)
	.list('stretchslice', Const.NUM_PARTS_STRETCHSLICE, StretchSliceParts)
	.list('audioin', Const.NUM_PARTS_AUDIOIN, AudioInParts)
	.list('accent', Const.NUM_PARTS_ACCENT, AccentParts)
	.list('fxparam', Const.NUM_PARAMETERS_FX, FXParam)
	.list('motionparam', Const.NUM_PARAMETERS_MOTION, MotionParam)
	;

var Pattern = new Format()
	.buffer('name', 8, ESXString)
	.uint16BE('tempo', Tempo)
	.nest('swing', Swing)
	.uint8('flags', PatternFlags)
	.uint8('fxchain')
	.uint8('laststep')
	.uint8('arpflags', ArpFlags)
	.uint8('arpcenternote')
	.uint16LE('mutestatus')
	.uint16LE('swingstatus')
	.uint16LE('outputbusstatus')
	.uint16LE('accentstatus')
	.nest('parts', PatternParts)
	;


module.exports = Pattern;
