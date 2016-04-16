'use strict';

var Format = require('bin-format');
var Enum = require('./enum');
var Utils = require('./utils');

var NoteNumberEnum = Enum.enumerate({
	CN1: 0, // C -1
	CSN1: 1, // C# -1
	DN1: 2, // D -1
	DSN1: 3, // D# -1
	EN1: 4, // E -1
	FN1: 5, // F -1
	FSN1: 6, // F# -1
	GN1: 7, // G -1
	GSN1: 8, // G# -1
	AN1: 9, // A -1
	ASN1: 10, // A# -1
	BN1: 11, // B -1
	C0: 12, // C 0
	CS10: 13, // C# 0
	D0: 14, // D 0
	DS0: 15, // D# 0
	E0: 16, // E 0
	F0: 17, // F 0
	FS0: 18, // F# 0
	G0: 19, // G 0
	GS0: 20, // G# 0
	A0: 21, // A 0
	AS0: 22, // A# 0
	B0: 23, // B 0
	C1: 24, // C 1
	CS11: 25, // C# 1
	D1: 26, // D 1
	DS1: 27, // D# 1
	E1: 28, // E 1
	F1: 29, // F 1
	FS1: 30, // F# 1
	G1: 31, // G 1
	GS1: 32, // G# 1
	A1: 33, // A 1
	AS1: 34, // A# 1
	B1: 35, // B 1
	C2: 36, // C 2
	CS12: 37, // C# 2
	D2: 38, // D 2
	DS2: 39, // D# 2
	E2: 40, // E 2
	F2: 41, // F 2
	FS2: 42, // F# 2
	G2: 43, // G 2
	GS2: 44, // G# 2
	A2: 45, // A 2
	AS2: 46, // A# 2
	B2: 47, // B 2
	C3: 48, // C 3
	CS13: 49, // C# 3
	D3: 50, // D 3
	DS3: 51, // D# 3
	E3: 52, // E 3
	F3: 53, // F 3
	FS3: 54, // F# 3
	G3: 55, // G 3
	GS3: 56, // G# 3
	A3: 57, // A 3
	AS3: 58, // A# 3
	B3: 59, // B 3
	C4: 60, // C 4
	CS14: 61, // C# 4
	D4: 62, // D 4
	DS4: 63, // D# 4
	E4: 64, // E 4
	F4: 65, // F 4
	FS4: 66, // F# 4
	G4: 67, // G 4
	GS4: 68, // G# 4
	A4: 69, // A 4
	AS4: 70, // A# 4
	B4: 71, // B 4
	C5: 72, // C 5
	CS15: 73, // C# 5
	D5: 74, // D 5
	DS5: 75, // D# 5
	E5: 76, // E 5
	F5: 77, // F 5
	FS5: 78, // F# 5
	G5: 79, // G 5
	GS5: 80, // G# 5
	A5: 81, // A 5
	AS5: 82, // A# 5
	B5: 83, // B 5
	C6: 84, // C 6
	CS16: 85, // C# 6
	D6: 86, // D 6
	DS6: 87, // D# 6
	E6: 88, // E 6
	F6: 89, // F 6
	FS6: 90, // F# 6
	G6: 91, // G 6
	GS6: 92, // G# 6
	A6: 93, // A 6
	AS6: 94, // A# 6
	B6: 95, // B 6
	C7: 96, // C 7
	CS17: 97, // C# 7
	D7: 98, // D 7
	DS7: 99, // D# 7
	E7: 100, // E 7
	F7: 101, // F 7
	FS7: 102, // F# 7
	G7: 103, // G 7
	GS7: 104, // G# 7
	A7: 105, // A 7
	AS7: 106, // A# 7
	B7: 107, // B 7
	C8: 108, // C 8
	CS18: 109, // C# 8
	D8: 110, // D 8
	DS8: 111, // D# 8
	E8: 112, // E 8
	F8: 113, // F 8
	FS8: 114, // F# 8
	G8: 115, // G 8
	GS8: 116, // G# 8
	A8: 117, // A 8
	AS8: 118, // A# 8
	B8: 119, // B 8
	C9: 120, // C 9
	CS19: 121, // C# 9
	D9: 122, // D 9
	DS9: 123, // D# 9
	E9: 124, // E 9
	F9: 125, // F 9
	FS9: 126, // F# 9
	G9: 127, // G 9
});

class NoteNumber {
	constructor(data) {
		this.data = data;
		this.note = new NoteNumberEnum(data & Utils.mask(0, 6));
		this.off = (data & (1 << 7)) > 0;
	}

	serialize() {
		return this.data;
	}
}

module.exports = NoteNumber;
