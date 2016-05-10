var test = require('tape');
var path = require('path');
var fs   = require('fs');

var utils = require('./test_utils');

var electribe = require('../index');

// function findSampleByName(name, samples) {
// 	for (var i=0; i<samples.length; i++) {
// 		if (!samples[i])
// 			continue;
// 		if (samples[i].sample.name.value == name)
// 			return samples[i];
// 	}
// 	return null;
// }
//
// function saveBuffer(name, buffer) {
// 	var fd = fs.openSync(name, 'w');
// 	fs.writeSync(fd, buffer, 0, buffer.length);
// 	fs.closeSync(fd);
// }

test('ESX1: Common', function(t) {
	var Common = require('../src/common');

	var input = utils.uintFromBits(utils.uint16TestPattern);
	var params = new Common.MuteSoloParameters(input);
	var output = params.serialize();
	t.equals(input, output, 'MuteSoloParameters OK');

	var input = utils.uintFromBits(utils.uint16TestPattern);
	var sliceNumber = new Common.SliceNumber(input);
	var output = sliceNumber.serialize();
	t.equals(input, output, 'SliceNumber OK');

	var input = utils.uintFromBits(utils.uint16TestPattern);
	var samplePointer = new Common.SamplePointer(input);
	var output = samplePointer.serialize();
	t.equals(input, output, 'SamplePointer OK');

	t.end();
});


var TESTFILE = 'data/ESX-Factory-Data.esx';

test('ESX1: Basic read-write', function(t) {
	t.ok('esx1' in electribe, 'ESX1 module exists');
	var esx = electribe.esx1;

	fs.readFile(TESTFILE, function(err, buffer) {
		if (err) {
			t.ok(false, 'Could not read test data: ' + TESTFILE);
			t.end();
			return;
		}

		var result = esx.parse(buffer);
		t.ok(result, 'Parse OK');
		var verification = esx.write(result, { blocksize: 1024 * 1024 * 2 });
		t.ok(verification, 'Write OK');
		t.deepEquals(buffer, verification, 'Input matches output');
		t.end();
	});
});
