'use strict';

// based on http://skratchdot.com/projects/open-electribe-editor/javadocs/index.html?com/skratchdot/electribe/model/esx/EsxFile.html

var fs = require('fs');
var Format = require('bin-format');

var GlobalParameters = require('./src/global');
var Pattern = require('./src/pattern');
var Song = require('./src/song');
var SongEvents = require('./src/songevents');

// TODO: make tests
console.log('GlobalParameters length: ', GlobalParameters.length(), 192);
console.log('Pattern length: ', Pattern.length(), 4280);

var ESXFile = new Format()
	.buffer('header', 32)
	.nest('global', GlobalParameters)
	.buffer('_unknown0', 288) // unknown, all 0x00
	.list('patterns', 256, Pattern)
	.buffer('_unknown1', 148992)
	.list('songs', 64, Song)
	.buffer('songevents', 20000 * 8, SongEvents)
/*
	.buffer('_unknown2', 330496)
	.buffer('bpsheader', 32)
	.uint32BE('numMonoSamples')
	.uint32BE('numStereoSamples')
	.uint32BE('currentSampleOffset')
	.buffer('_unknown3', 212)
	.buffer('monoSampleHeaders', 256 * 40)
	.buffer('stereoSampleHeaders', 128 * 44)
	.buffer('_unknown4', 768)
	.buffer('slices', 256 * 2048)
*/
	.buffer('sampledata', 'eof');


// var TESTFILE = 'data/ESX-Factory-Data.esx';
var TESTFILE = 'data/saved.esx';
fs.readFile(TESTFILE, function(err, buffer) {
	if (err)
		throw err;

	console.time('parse');
	var result = ESXFile.parse(buffer);
	result.songevents.parse(result.songs);
	console.timeEnd('parse');

	console.log('Parsing complete:');
	console.time('inspect');
	// console.log(result);
	// console.log(require('util').inspect(result, { depth: null }));
	// console.log(require('util').inspect(result.songs, { depth: null }));
	console.log(require('util').inspect(result.songevents, { depth: null }));
	console.timeEnd('inspect');
});
