'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');
var Common = require('./common');

var FXType = Enum.enumerate({
	REVERB: 0,
	BPM_SYNC_DELAY: 1,
	SHORT_DELAY: 2,
	MOD_DELAY: 3,
	GRAIN_SHIFTER: 4,
	CHO_FLG: 5,
	PHASER: 6,
	RING_MOD: 7,
	TALKING_MOD: 8,
	PITCH_SHIFTER: 9,
	COMPRESSOR: 10,
	DISTORTION: 11,
	DECIMATOR: 12,
	EQ: 13,
	LPF: 14,
	HPF: 15,
});

// Reference: TABLE23
class FXSequenceSteps {
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

var Bar = new Format()
	.uint8('steps', FXSequenceSteps);

var FXParam = new Format()
	.uint8('fxtype', FXType)
	.uint8('edit1') // 0-127
	.uint8('edit2') // 0-127
	.nest('motionseqstatus', Common.MotionSequenceStatus) // 0~2 : Off/Smooth/TrigHold
	;

module.exports = FXParam;
