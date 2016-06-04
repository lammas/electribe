'use strict';

var Format = require('bin-format');
var Const = require('./constants');
var GlobalParameters = require('./global');
var Pattern = require('./pattern');
var Song = require('./song');
var SongEvents = require('./songevents');
var Sample = require('./sample');
var Slice = require('./slice');
var SampleData = require('./sampledata');

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

function parse(buffer) {
	var result = ESXFile.parse(buffer);
	if ('songevents' in result)
		result.songevents.parse(result.songs);
	if ('sampledata' in result)
		result.sampledata.parse(result);
	return result;
}

function write(esx, options) {
	return ESXFile.write(esx, options);
}

module.exports = {
	format: ESXFile,
	parse: parse,
	write: write
};
