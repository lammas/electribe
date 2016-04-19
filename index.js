// References:
//    [1] http://skratchdot.com/projects/open-electribe-editor/
//    [2] ESX1midiimp.txt from korg.de

'use strict';

var fs = require('fs');
var Format = require('bin-format');

var Const = require('./src/constants');
var GlobalParameters = require('./src/global');
var Pattern = require('./src/pattern');
var Song = require('./src/song');
var SongEvents = require('./src/songevents');
var Sample = require('./src/sample');
var Slice = require('./src/slice');
var SampleData = require('./src/sampledata');

console.log('GlobalParameters length: ', GlobalParameters.length(), 192);
console.log('Pattern length: ', Pattern.length(), 4280);

var ESXFile = new Format()
	.buffer('header', 32)
	.nest('global', GlobalParameters)
	.buffer('_unknown0', 288) // this is all 0x00
	.list('patterns', 256, Pattern)
	.buffer('_unknown1', 148992) // this has data
	.list('songs', 64, Song)
	.buffer('songevents', Const.MAX_NUM_SONG_EVENTS * Const.CHUNKSIZE_SONG_EVENT, SongEvents)
	.buffer('_unknown2', 330496) // this also has data
	.buffer('bpsheader', 32)
	.uint32BE('numMonoSamples')
	.uint32BE('numStereoSamples')
	.uint32BE('currentSampleOffset')
	.buffer('_unknown3', 212) // this is all 0x00
	.list('monoSampleHeaders', Const.NUM_SAMPLES_MONO, Sample.Mono)
	.list('stereoSampleHeaders', Const.NUM_SAMPLES_STEREO, Sample.Stereo)
	.buffer('_unknown4', 768) // this is all 0x00
	.list('slices', Const.NUM_SAMPLES_MONO, Slice)
	.buffer('_unknown5', 114176) // this is all 0x00
	.buffer('sampledata', 'eof', SampleData);

var TESTFILE = 'data/ESX-Factory-Data.esx';
// var TESTFILE = 'data/saved.esx';
fs.readFile(TESTFILE, function(err, buffer) {
	if (err)
		throw err;

	console.time('parse');
	var result = ESXFile.parse(buffer);
	if ('songevents' in result)
		result.songevents.parse(result.songs);
	if ('sampledata' in result)
		result.sampledata.parse(result);
	console.timeEnd('parse');

	function findSampleByName(name, samples) {
		for (var i=0; i<samples.length; i++) {
			if (samples[i].sample.name.value == name)
				return samples[i];
		}
		return null;
	}

	function saveBuffer(name, buffer) {
		var fd = fs.openSync(name, 'w');
		fs.writeSync(fd, buffer, 0, buffer.length);
		fs.closeSync(fd);
	}

	// console.time('inspect');
	// console.log(result);
	// console.log(require('util').inspect(result, { depth: null }));
	// console.log(require('util').inspect(result.songs, { depth: null }));
	// console.log(require('util').inspect(result.songevents, { depth: null }));
	// console.log(require('util').inspect(result.monoSampleHeaders, { depth: null }));
	// console.log(require('util').inspect(result.stereoSampleHeaders, { depth: null }));
	// console.log(require('util').inspect(result.slices, { depth: null }));
	// console.log(require('util').inspect(result.sampledata, { depth: null }));
	// console.timeEnd('inspect');

	// var sample = result.sampledata.samples[3];
	var sample = findSampleByName('PercLP-1', result.sampledata.samples);
	if (sample) {
		console.log('Investigating sample: ', sample);
		console.log(sample.header.toString());
		// saveBuffer('./perclp1.wav', sample.data);
	}
});
