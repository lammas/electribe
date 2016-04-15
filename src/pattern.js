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

var DrumParts = new Format()
	.buffer('data', Const.CHUNKSIZE_PARTS_DRUM);

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
