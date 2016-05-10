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

class MSBOff16BE {
	constructor(data) {
		this.data = data;
		this.value = data & Utils.mask(0, 14);
		this.off = (data & (1 << 15)) > 0;
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

class SamplePointer {
	constructor(data) {
		this.sample = Utils.mask(0, 14) & data;
		this.off = ((1 << 15) & data) > 0;
	}

	serialize() {
		var data = this.sample;
		if (this.off)
			data |= (1 << 15);
		return data;
	}
}

class SliceNumber {
	constructor(data) {
		this.slice = Utils.mask(0, 14) & data;
		this.all = ((1 << 15) & data) > 0;
	}

	serialize() {
		var data = this.slice;
		if (this.all)
			data |= (1 << 15);
		return data;
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

// TABLE22
class MuteSoloParameters {
	constructor(data) {
		this.mode = (data & (1 << 15)) == 0 ? 'mute' : 'solo';
		this.flags = [];
		for (var i = 14; i >= 0; i--) {
			this.flags.push( data & (1 << i) ? 1 : 0 );
		}
	}

	serialize() {
		var data = 0;
		if (this.mode == 'solo')
			data |= (1 << 15)
		for (var i = 0; i < 15; i++) {
			if (this.flags[i] == 0)
				continue;
			data |= (1 << (14 - i));
		}
		return data;
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
	MSBOff16BE: MSBOff16BE,
	SamplePointer: SamplePointer,
	SliceNumber: SliceNumber,

	Tempo: Tempo,

	MuteSoloParameters: MuteSoloParameters,
};
