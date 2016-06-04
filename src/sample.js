'use strict';

var Format = require('bin-format');
var ESXString = require('./string');
var Common = require('./common');
var Enum = require('./enum');
var Const = require('./constants');
var Utils = require('./utils');

class SampleTune {
	constructor(data) {
		this.sampleTuneNegative = Utils.unpackInt(data, 1, 15);
		this.sampleTuneWhole = Utils.unpackInt(data, 7, 8);
		this.sampleTuneDecimal = Utils.unpackInt(data, 8, 0);
	}

	get value() {
		// valid sampleTuneDecimal values are between 0-99
		if (this.sampleTuneDecimal > 99 || this.sampleTuneDecimal < 0) {
			this.sampleTuneDecimal = 0;
		}

		// Construct the float value as a string
		var s = "";
		if (this.sampleTuneNegative == 1 && this.sampleTuneWhole > 0) {
			s = "-";
		}
		s += this.sampleTuneWhole + "." + ("00" + this.sampleTuneDecimal).slice(-2);
		return parseFloat(s);
	}

	set value(tune) {
		this.sampleTuneNegative = tune < 0 ? 1 : 0;
		tune = Math.abs(tune);

		this.sampleTuneWhole = Math.floor(tune);
		this.sampleTuneDecimal = Math.floor( (tune % 1) * 100 );

		if (this.sampleTuneDecimal > 99 || this.sampleTuneDecimal < 0) {
			this.sampleTuneDecimal = 0;
		}
	}

	serialize() {
		var value = 0;
		value = Utils.packInt(value, this.sampleTuneNegative, 1, 15);
		value = Utils.packInt(value, this.sampleTuneWhole, 7, 8);
		value = Utils.packInt(value, this.sampleTuneDecimal, 8, 0);
		return value;
	}
}

var PlayLevel = Enum.enumerate({
	DB_0: 0,
	DB_PLUS12: 1,
	DB_UNINITIALIZED: 0xFF
});

class StretchStep {
	constructor(data) {
		this.value = Utils.unpackInt(data, 7, 0);
		this.off = Utils.unpackInt(data, 1, 7) == 1;
	}

	serialize() {
		var value = Utils.packInt(0, this.value, 7, 0);
		if (this.off)
			value |= (1 << 7);
		return value;
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
	.uint8('stretchstep', StretchStep)
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
	.uint8('stretchstep', StretchStep)
	.uint8('_unknown1')
	.uint8('_unknown2')
	.uint8('_unknown3')
	;

module.exports = {
	SampleTune: SampleTune,
	Mono: SampleMono,
	Stereo: SampleStereo
};
