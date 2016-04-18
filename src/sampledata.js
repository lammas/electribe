'use strict';

var Format = require('bin-format');
var Const = require('./constants');

class WaveData {
	constructor(data, sampleHeader) {
		this.sample = sampleHeader;
		this.header = data.slice(0, 16);
		this.data = data.slice(16);
		this.numframes = this.data.length / 2;
	}
}

class WaveDataStereo {
	constructor(left, right, sampleHeader) {
		this.left = new WaveData(left, sampleHeader);
		this.right = new WaveData(right, sampleHeader);
	}
}

class SampleData {
	constructor(data) {
		this.data = data;
		this.samples = [];
	}

	parse(esx) {
		for (var i = 0; i < Const.NUM_SAMPLES; i++) {
			if (i < Const.NUM_SAMPLES_MONO) {
				var sampleHeader = esx.monoSampleHeaders[i];
				var size = sampleHeader.offsetchannel1end - sampleHeader.offsetchannel1start;
				if (size > 0 && sampleHeader.offsetchannel1start != 0xFFFFFFFF &&
					sampleHeader.offsetchannel1end != 0xFFFFFFFF) {
					var sampleData = this.data.slice(sampleHeader.offsetchannel1start, sampleHeader.offsetchannel1end);
					this.samples.push(new WaveData(sampleData, sampleHeader));
				}
				else {
					this.samples.push(null);
				}
			}
			else {
				var sampleHeader = esx.stereoSampleHeaders[i - Const.NUM_SAMPLES_MONO];
				var size1 = sampleHeader.offsetchannel1end - sampleHeader.offsetchannel1start;
				var size2 = sampleHeader.offsetchannel2end - sampleHeader.offsetchannel2start;
				if (size1 > 0 && size2 > 0 && size1 == size2 &&
					sampleHeader.offsetchannel1start != 0xFFFFFFFF &&
					sampleHeader.offsetchannel1end != 0xFFFFFFFF &&
					sampleHeader.offsetchannel2start != 0xFFFFFFFF &&
					sampleHeader.offsetchannel2end != 0xFFFFFFFF
				) {
					var dataLeft = this.data.slice(sampleHeader.offsetchannel1start, sampleHeader.offsetchannel1end);
					var dataRight = this.data.slice(sampleHeader.offsetchannel2start, sampleHeader.offsetchannel2end);
					this.samples.push(new WaveDataStereo(dataLeft, dataRight, sampleHeader));
				}
				else {
					this.samples.push(null);
				}
			}
		}
	}

	serialize() {
		return this.data;
	}
}

module.exports = SampleData;
