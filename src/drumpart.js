'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');

var Common = require('./common');

// Reference: TABLE23
class DrumSequenceSteps {
	constructor(data) {
		this.steps = [];
		for (var i = 7; i >= 0; i--) {
			this.steps.push( data & (1 << i) ? 1 : 0 );
		}
	}

	serialize() {
		return Utils.uintFromBits(this.steps);
	}
}

var DrumSequenceBar = new Format()
	.uint8('steps', DrumSequenceSteps);

var DrumPart = new Format()
	.uint16BE('samplepointer', Common.SamplePointer)
	.uint16BE('slicenumber', Common.SliceNumber)
	// There is conflicting info on this in the "ESX1_Midi_Imp.txt" file
	// TABLE6 says "reserved", but TABLE1 infers byte2 and byte3 are sliceNumber
	// .uint8('_unknown0')

	.nest('filtertype', Common.FilterType)
	.uint8('cutoff') // 0-127
	.uint8('resonance') // 0-127
	.uint8('egint') // 0~64~127 : -63~0~+63
	.uint8('pitch') // 0~127 (64=equal pitch)
	.uint8('level') // 0-127
	.uint8('pan') // 0~127 (64=center)
	.uint8('egtime') // 0-127
	.uint8('startpoint') // 0-127
	.uint8('fxflags', Common.FXFlags)
	.uint8('modflags', Common.ModFlags)
	.uint8('modspeed') // 0-127
	.uint8('moddepth') // 0~64~127 : -63~0~+63
	.nest('motionseqstatus', Common.MotionSequenceStatus) // 0~2 : Off/Smooth/TrigHold
	.list('sequencedata', Const.NUM_SEQUENCE_DATA, DrumSequenceBar)
	;

module.exports = DrumPart;
