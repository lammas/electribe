var test = require('tape');
var path = require('path');
var fs   = require('fs');
var util = require('util');

var electribe = require('../index');

function inspect(o) {
	console.log(util.inspect(o, { depth: null }));
}

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
