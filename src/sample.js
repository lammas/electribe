'use strict';

var Format = require('bin-format');
var ESXString = require('./string');
var Common = require('./common');
var Enum = require('./enum');
var Const = require('./constants');
var Utils = require('./utils');

class SampleTune {
	constructor(data) {
		this.data = data;
		this.sampleTuneNegative = Utils.unpackInt(data, 1, 15);
		this.sampleTuneWhole = Utils.unpackInt(data, 7, 8);
		this.sampleTuneDecimal = Utils.unpackInt(data, 8, 0);

		// valid sampleTuneDecimal values are between 0-99
		if (this.sampleTuneDecimal > 99 || this.sampleTuneDecimal < 0) {
			this.sampleTuneDecimal = 0;
		}

		// Now construct the float value as a string
		var s = "";
		if (this.sampleTuneNegative == 1 && this.sampleTuneWhole > 0) {
			s = "-";
		}
		s += this.sampleTuneWhole + "." + ("00" + this.sampleTuneDecimal).slice(-2);
		this.value = parseFloat(s)
	}

	serialize() {
		return this.data;
	}
}

var PlayLevel = Enum.enumerate({
	DB_0: 0,
	DB_PLUS12: 1,
	DB_UNINITIALIZED: 0xFF
});

class StretchStep {
	constructor(data) {
		this.data = data;
		this.off = data < 0 ? true : false;
	}

	serialize() {
		return this.data;
	}
}

var SampleMono = new Format()
	.buffer('name', 8, ESXString)
	.uint32BE('offsetchannel1start')
	.uint32BE('offsetchannel1end')
	.uint32BE('start')
	.uint32BE('end')
	.uint32BE('loopstart')
	.uint32BE('samplerate')
	.uint16BE('sampletune', SampleTune)
	.uint8('playlevel', PlayLevel)
	.uint8('_unknown0')
	.int8('stretchstep', StretchStep)
	.uint8('_unknown1')
	.uint8('_unknown2')
	.uint8('_unknown3')
	;

	var SampleStereo = new Format()
		.buffer('name', 8, ESXString)
		.uint32BE('offsetchannel1start')
		.uint32BE('offsetchannel1end')
		.uint32BE('offsetchannel2start')
		.uint32BE('offsetchannel2end')
		.uint32BE('start')
		.uint32BE('end')
		.uint32BE('samplerate')
		.uint16BE('sampletune', SampleTune)
		.uint8('playlevel', PlayLevel)
		.uint8('_unknown0')
		.int8('stretchstep', StretchStep)
		.uint8('_unknown1')
		.uint8('_unknown2')
		.uint8('_unknown3')
		;

module.exports = {
	Mono: SampleMono,
	Stereo: SampleStereo
};
