'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');

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

module.exports = DrumPart;
