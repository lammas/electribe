'use strict';

var Format = require('bin-format');
var Utils = require('./utils');
var Const = require('./constants');
var Enum = require('./enum');
var Common = require('./common');

var SequenceGate = new Format()
	.uint8('gate');

// Reference: TABLE7
var KeyboardPart = new Format()
	.uint16BE('samplepointer', Common.SamplePointer)
	.uint16BE('slicenumber', Common.SliceNumber)
	// There is conflicting info on this in the "ESX1_Midi_Imp.txt" file
	// TABLE6 says "reserved", but TABLE1 infers byte2 and byte3 are sliceNumber
	// .uint8('_unknown0')

	.uint8('glide', Common.MSBOff8) // 0~127 : Off,1~127
	.nest('filtertype', Common.FilterType)
	.uint8('cutoff') // 0-127
	.uint8('resonance') // 0-127
	.uint8('egint') // 0~64~127 : -63~0~+63
	.uint8('level') // 0-127
	.uint8('pan') // 0~127 (64=center)
	.uint8('egtime') // 0-127
	.uint8('startpoint') // 0-127
	.uint8('fxflags', Common.FXFlags)
	.uint8('modflags', Common.ModFlags)
	.uint8('modspeed') // 0-127
	.uint8('moddepth') // 0~64~127 : -63~0~+63
	.nest('motionseqstatus', Common.MotionSequenceStatus) // 0~2 : Off/Smooth/TrigHold
	.list('sequenceNote', Const.NUM_SEQUENCE_DATA_NOTE, new Format().uint8('note', Common.NoteNumber))
	.list('sequenceGate', Const.NUM_SEQUENCE_DATA_GATE, SequenceGate)
	;

module.exports = KeyboardPart;
