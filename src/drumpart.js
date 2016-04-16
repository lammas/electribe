'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');

var FilterType = Enum.uint8({
	LPF: 0, // LPF
	HPF: 1, // HPF
	BPF: 2, // BPF
	BPF_PLUS: 3 // BPF+
});

var MotionSequenceStatus = Enum.uint8({
	OFF: 0,
	SMOOTH: 1,
	TRIGHOLD: 2
});

var FXSelect = Enum.enumerate({
	FX1: 0,
	FX2: 1,
	FX3: 2
});

var AmpEg = Enum.enumerate({
	GATE: 0,
	EG: 1
});

class FXFlags {
	constructor(value) {
		this.value = value;
		this.FxSelect = new FXSelect(Utils.unpackInt(value, 2, 0));
		this.FxSend = Utils.unpackInt(value, 1, 2);
		this.Roll = Utils.unpackInt(value, 1, 3);
		this.AmpEg = new AmpEg(Utils.unpackInt(value, 1, 4));
		this.Reverse = Utils.unpackInt(value, 1, 5);
		this.ReservedBitsAfterReverse = Utils.unpackInt(value, 2, 6);
	}

	serialize() {
		// TODO: pack
		return this.value;
	}
}

class ModFlags {
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
	.uint16BE('samplepointer')
	.uint8('slicenumber')
	// There is conflicting info on this in the "ESX1_Midi_Imp.txt" file
	// TABLE6 says "reserved", but TABLE1 infers byte2 and byte3 are
	// sliceNumber
	.uint8('_unknown0')
	.nest('filtertype', FilterType)
	.uint8('cutoff') // 0-127
	.uint8('resonance') // 0-127
	.uint8('egint') // 0~64~127 : -63~0~+63
	.uint8('pitch') // 0~127 (64=equal pitch)
	.uint8('level') // 0-127
	.uint8('pan') // 0~127 (64=center)
	.uint8('egtime') // 0-127
	.uint8('startpoint') // 0-127
	.uint8('fxflags', FXFlags)
	.uint8('modflags', ModFlags)
	.uint8('modspeed') // 0-127
	.uint8('moddepth') // 0~64~127 : -63~0~+63
	.nest('motionseqstatus', MotionSequenceStatus) // 0~2 : Off/Smooth/TrigHold
	.list('sequencedata', Const.NUM_SEQUENCE_DATA, DrumSequenceBar)
	;

module.exports = DrumPart;
