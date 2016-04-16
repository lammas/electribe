'use strict';

var Enum = require('./enum');
var Utils = require('./utils');
var NoteNumber = require('./notenumber');

var EnabledFlag = Enum.uint8({
	DISABLED: 0,
	ENABLED: 1
});

class MSBOff8 {
	constructor(data) {
		this.data = data;
		this.value = data & Utils.mask(0, 6);
		this.off = (data & (1 << 7)) > 0;
	}

	serialize() {
		// TODO: pack values
		return this.data;
	}
}

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

var ModDest = Enum.enumerate({
	PITCH: 0,
	CUTOFF: 1,
	AMP: 2,
	PAN: 3
});

var ModType = Enum.enumerate({
	SAWTOOTH: 0,
	SQUARE: 1,
	TRIANGLE: 2,
	SAMPLEANDHOLD: 3,
	ENVELOPE: 4
});

class ModFlags {
	constructor(value) {
		this.value = value;
		this.ModDest = new ModDest(Utils.unpackInt(value, 3, 0));
		this.ReservedBitAfterModDepth = Utils.unpackInt(value, 1, 3);
		this.ModType = new ModType(Utils.unpackInt(value, 3, 4));
		this.BpmSync = Utils.unpackInt(value, 1, 7);
	}

	serialize() {
		// TODO: pack
		return this.value;
	}
}

module.exports = {
	EnabledFlag: EnabledFlag,
	NoteNumber: NoteNumber,
	FilterType: FilterType,
	MotionSequenceStatus: MotionSequenceStatus,
	FXSelect: FXSelect,
	AmpEg: AmpEg,

	FXFlags: FXFlags,
	ModFlags: ModFlags,
	ModDest: ModDest,
	ModType: ModType,

	MSBOff8: MSBOff8,
};
