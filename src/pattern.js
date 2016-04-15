'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var ESXString = require('./string');

class PatternFlags {
	constructor(value) {
		this._value = value;
		this.patternLength = Utils.unpackInt(value, 3, 0);
		this._reserved = Utils.unpackInt(value, 1, 3);
		this.beat = Utils.unpackInt(value, 2, 4);
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

var DrumParts = new Format()
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
	.buffer('sequencedata', Const.NUM_SEQUENCE_DATA);

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
	.list('drum', Const.NUM_PARTS_DRUM, DrumParts)
	.list('keyboard', Const.NUM_PARTS_KEYBOARD, KeyboardParts)
	.list('stretchslice', Const.NUM_PARTS_STRETCHSLICE, StretchSliceParts)
	.list('audioin', Const.NUM_PARTS_AUDIOIN, AudioInParts)
	.list('accent', Const.NUM_PARTS_ACCENT, AccentParts)
	.list('fxparam', Const.NUM_PARAMETERS_FX, FXParam)
	.list('motionparam', Const.NUM_PARAMETERS_MOTION, MotionParam)
	;

var Pattern = new Format()
	.buffer('name', 8, ESXString)
	.uint16LE('tempo')
	.uint8('swing')
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
