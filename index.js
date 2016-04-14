'use strict';

// based on http://skratchdot.com/projects/open-electribe-editor/javadocs/index.html?com/skratchdot/electribe/model/esx/EsxFile.html

var fs = require('fs');
var Format = require('bin-format');

// var Enum = require('./src/enumparser');
var GlobalParameters = require('./src/global');


var ESXFile = new Format()
	.buffer('header', 32)
	//.buffer('global', 192)
	.nest('global', GlobalParameters)
/*
	.buffer('unknown0', 288) // unknown
	.buffer('patterns', 256 * 4280)
	.buffer('unknown1', 148992)
	.buffer('songs', 64 * 528)
	.buffer('songevents', 20000 * 8)
	.buffer('unknown2', 330496)
	.buffer('bpsheader', 32)
	.uint32BE('numMonoSamples')
	.uint32BE('numStereoSamples')
	.uint32BE('currentSampleOffset')
	.buffer('unknown3', 212)
	.buffer('monoSampleHeaders', 256 * 40)
	.buffer('stereoSampleHeaders', 128 * 44)
	.buffer('unknown4', 768)
	.buffer('slices', 256 * 2048)
*/
	.buffer('sampledata', 'eof');


// var TESTFILE = '../ESX-Factory-Data.esx';
var TESTFILE = '../saved.esx';
fs.readFile(TESTFILE, function(err, buffer) {
	if (err)
		throw err;
	console.log('Got data');
	var result = ESXFile.parse(buffer);
	console.log('Parsing complete:');
	console.log(require('util').inspect(result, { depth: null }));
});
