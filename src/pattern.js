'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');
var ESXString = require('./string');
var Common = require('./common');

var DrumPart = require('./drumpart');
var KeyboardPart = require('./keyboardpart');
var StretchSlicePart = require('./stretchslicepart');
var AudioInPart = require('./audioinpart');
var AccentPart = require('./accentpart');
var FXParam = require('./fxparam');
var MotionParam = require('./motionparam');

var Beat = Enum.enumerate({
	BEAT_16TH: 0,
	BEAT_32ND: 1,
	BEAT_8TRI: 2,
	BEAT_16TRI:3
});

// TODO: more descriptive names
var RollType = Enum.enumerate({
	ROLL_2: 0,
	ROLL_3: 1,
	ROLL_4: 2
});

var ArpScale = Enum.enumerate({
	CHROMATIC: 0, // Chromatic
	IONIAN: 1, // Ionian
	DORIAN: 2, // Dorian
	PHRYGIAN: 3, // Phrygian
	LYDIAN: 4, // Lydian
	MIXOLYDIAN: 5, // Mixolydian
	AEOLIAN: 6, // Aeolian
	LOCRIAN: 7, // Locrian
	MAJOR_BLUES: 8, // Major Blues
	MINOR_BLUES: 9, // minor Blues
	DIMINISH: 10, // Diminish
	COMBINATION_DIMINISH: 11, // Combination Diminish
	MAJOR_PENTATONIC: 12, // Major Pentatonic
	MINOR_PENTATONIC: 13, // minor Pentatonic
	RAGA_BHAIRAV: 14, // Raga Bhairav
	RAGA_GAMANASRAMA: 15, // Raga Gamanasrama
	RAGA_TODI: 16, // Raga Todi
	SPANISH_SCALE: 17, // Spanish Scale
	GYPSY_SCALE: 18, // Gypsy Scale
	ARABIAN_SCALE: 19, // Arabian Scale
	EGYPTIAN_SCALE: 20, // Egyptian Scale
	HAWAIIAN_SCALE: 21, // Hawaiian Scale
	BALI_ISLAND_SCALE: 22, // Bali Island Scale
	JAPANESE_MIYAKOBUSHI: 23, // Japanese Miyakobushi
	RYUKYU_SCALE: 24, // Ryukyu Scale
	WHOLETONE: 25, // Wholetone
	MINOR_3RD_INTERVAL: 26, // m3rd Interval
	MAJOR_3RD_INTERVAL: 27, // M3rd Interval
	FOURTH_INTERVAL: 28, // 4th Interval
	FIFTH_INTERVAL: 29, // 5th Interval
	OCTAVE_INTERVAL: 30, // Octave Interval
});

class PatternFlags {
	constructor(value) {
		this._value = value;
		this.patternLength = Utils.unpackInt(value, 3, 0); // 0-7 -> 1-8
		this._reserved = Utils.unpackInt(value, 1, 3);
		this.beat = new Beat(Utils.unpackInt(value, 2, 4));
		this.rollType = new RollType(Utils.unpackInt(value, 2, 6));
	}

	serialize() {
		// TODO: pack value
		return this._value;
	}
}

class ArpFlags {
	constructor(value) {
		this._value = value;
		this.arpScale = new ArpScale(Utils.unpackInt(value, 5, 0));
		this._reserved = Utils.unpackInt(value, 3, 5);
	}

	serialize() {
		// TODO: pack value
		return this._value;
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

var FXChain = Enum.uint8({
	FX_None:  0, // None
	FX_1_2:   1, // 1 -> 2
	FX_2_3:   2, // 2 -> 3
	FX_1_2_3: 3, // 1 -> 2 -> 3
});

// TABLE22
class PartStatusParameters {
	constructor(data) {
		this.data = data;
		this.flags = [];
		for (var i = 15; i >= 0; i--) {
			this.flags.push( data & (1 << i) ? 1 : 0 );
		}
	}

	serialize() {
		// TODO: pack
		return this.data;
	}
}

var PatternParts = new Format()
	.list('drum', Const.NUM_PARTS_DRUM, DrumPart)
	.list('keyboard', Const.NUM_PARTS_KEYBOARD, KeyboardPart)
	.list('stretchslice', Const.NUM_PARTS_STRETCHSLICE, StretchSlicePart)
	.list('audioin', Const.NUM_PARTS_AUDIOIN, AudioInPart)
	.list('accent', Const.NUM_PARTS_ACCENT, AccentPart)
	.list('fxparam', Const.NUM_PARAMETERS_FX, FXParam)
	.list('motionparam', Const.NUM_PARAMETERS_MOTION, MotionParam)
	;

var Pattern = new Format()
	.buffer('name', 8, ESXString)
	.uint16BE('tempo', Common.Tempo)
	.nest('swing', Swing)
	.uint8('flags', PatternFlags)
	.nest('fxchain', FXChain)
	.uint8('laststep') // 0-15
	.uint8('arpflags', ArpFlags)
	.uint8('arpcenternote', Common.NoteNumber)
	.uint16LE('mutestatus', Common.MuteSoloParameters)
	.uint16LE('swingstatus', PartStatusParameters)  // TODO: specific parameter classes
	.uint16LE('outputbusstatus', PartStatusParameters)
	.uint16LE('accentstatus', PartStatusParameters)
	.nest('parts', PatternParts)
	;


module.exports = Pattern;
