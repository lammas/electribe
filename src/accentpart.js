'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');
var Common = require('./common');

// Reference: TABLE23
class AccentSequenceSteps {
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
	.uint8('steps', AccentSequenceSteps);

var AccentPart = new Format()
	.uint8('level') // 0-127
	.nest('motionseqstatus', Common.MotionSequenceStatus) // 0~2 : Off/Smooth/TrigHold
	.list('sequencedata', Const.NUM_SEQUENCE_DATA, Bar)
	;

module.exports = AccentPart;
