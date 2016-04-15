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
	// .buffer('sequencedata', Const.NUM_SEQUENCE_DATA)
	;
	// the sequencedata is 16 bytes
	// each drum part has 8 * 16 (128) steps
	// which would imply that every bit represents one on/off value
	// TODO: where is the number of bars (Pattern > Length on ESX)

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

class Tempo {
	constructor(value) {
		this.value = value;

		// iiiiiiii i000ffff
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

var Pattern = new Format()
	.buffer('name', 8, ESXString)
	.uint16BE('tempo', Tempo)
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
