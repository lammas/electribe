'use strict';

var Format = require('bin-format');
var Const = require('./constants');

// PCM data header
// 80 00 7f ff 00 00 42 64 00 01 9a 8a 01 00 ff ff
// [signature]  |  |  |  |  |  |  |  |  |  |  |  |
//              |  |  |  |  |  |  |  |  +- uint8 (sequential ID)
//              |  |  |  |  |  |  |  |     |  |  |
//              |  |  |  |  +- uint32BE (end) |  |
//              +- uint32BE (start)        |  |  |
//                                         +- always static
//
// 'start' and 'end' are the same as offsetchannelXstart and offsetchannelXend

var WaveDataHeader = new Format()
	.buffer('signature', 4)
	.uint32BE('start')
	.uint32BE('end')
	.uint8('index')
	.uint8('zero')
	.uint16BE('ffff')
	;

class WaveData {
	constructor(data, sampleHeader) {
		this.sample = sampleHeader;
		this.header = WaveDataHeader.parse(data.slice(0, 16));
		this.data = data.slice(16);
		this.numframes = this.data.length / 2;
	}

	get length() {
		return this.data.length + 16;
	}

	serialize() {
		var data = Buffer.alloc(this.data.length, 0);
		var headerData = WaveDataHeader.write(this.header);
		headerData.copy(data, 0);
		this.data.copy(data, 16);
		return data;
	}
}

class WaveDataStereo {
	constructor(left, right, sampleHeader) {
		this.sample = sampleHeader;
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

	save() {
		var buffers = [];
		var totalLength = 0;
		var position = 0;

		for (var i = 0; i < Const.NUM_SAMPLES; i++) {
			var waveData = this.samples[i];
			if (!waveData)
				continue;

			if (i < Const.NUM_SAMPLES_MONO) {
				var sampleHeader = waveData.sample;
				var size = waveData.length;
				var offsetchannel1start = position;
				var offsetchannel1end = position + size;
				position += size;
				totalLength += size;
				waveData.header.start = waveData.sample.offsetchannel1start = offsetchannel1start;
				waveData.header.end = waveData.sample.offsetchannel1end = offsetchannel1end;
				buffers.push(waveData.serialize());
			}
			else {
				var sampleHeader = waveData.sample;
				var size1 = waveData.left.length;
				var size2 = waveData.right.length;
				var offsetchannel1start = position;
				var offsetchannel1end = position + size1;
				position += size1;
				totalLength += size1;
				var offsetchannel2start = position;
				var offsetchannel2end = position + size2;
				position += size2;
				totalLength += size2;

				waveData.sample.offsetchannel1start = offsetchannel1start;
				waveData.sample.offsetchannel1end = offsetchannel1end;
				waveData.sample.offsetchannel2start = offsetchannel2start;
				waveData.sample.offsetchannel2end = offsetchannel2end;

				waveData.left.header.start = offsetchannel1start;
				waveData.left.header.end = offsetchannel1end;
				waveData.right.header.start = offsetchannel2start;
				waveData.right.header.end = offsetchannel2end;

				buffers.push(waveData.left.serialize());
				buffers.push(waveData.right.serialize());
			}
		}

		delete this.data;
		this.data = Buffer.concat(buffers, totalLength);
	}

	serialize() {
		return this.data;
	}
}

module.exports = SampleData;
