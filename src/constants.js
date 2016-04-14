'use strict';

var constants = {};

constants['DEFAULT_SAMPLING_RATE'] = 44100;

// 0x00000000 -> 0x00000020 (32 unknown bytes)
// K O R G . . . 0x71 E S X
constants['ADDR_VALID_ESX_CHECK_1'] = 0x00000000;

// 192 bytes
constants['ADDR_GLOBAL_PARAMETERS'] = 0x00000020;

// 0x000000E0 -> 0x00000200 (288 unknown/reserved? bytes)
constants['ADDR_UNKNOWN_SECTION_1'] = 0x000000E0;

// 256 patterns at 4280 bytes each
constants['ADDR_PATTERN_DATA'] = 0x00000200;

// After getting to ADDR_PATTERN_DATA, the
// PART data starts at the given offsets.
constants['PATTERN_OFFSET_PARTS_DRUM'] = 24;
constants['PATTERN_OFFSET_PARTS_KEYBOARD'] = 330;
constants['PATTERN_OFFSET_PARTS_STRETCHSLICE'] = 878;
constants['PATTERN_OFFSET_PARTS_AUDIOIN'] = 974;
constants['PATTERN_OFFSET_PARTS_ACCENT'] = 1130;
constants['PATTERN_OFFSET_PARAMETERS_FX'] = 1148;
constants['PATTERN_OFFSET_PARAMETERS_MOTION'] = 1160;

// 0x0010BA00 -> 0x00130000 (148992 unknown/reserved? bytes)
constants['ADDR_UNKNOWN_SECTION_2'] = 0x0010BA00;

// 64 songs at 528 bytes each
constants['ADDR_SONG_DATA'] = 0x00130000;

// Up to 20000 song events at 8 bytes each
constants['ADDR_SONG_EVENT_DATA'] = 0x00138400;

// 0x0015F500 -> 0x001B0000 (330496 unknown/reserved? bytes)
constants['ADDR_UNKNOWN_SECTION_3'] = 0x0015F500;

// 0x001B0000 -> 0x001B0020 (32 unknown bytes)
// K O R G . . . 0x71 B P X
constants['ADDR_VALID_ESX_CHECK_2'] = 0x001B0000;

// Number of mono samples being used (4 bytes)
constants['ADDR_NUM_MONO_SAMPLES'] = 0x001B0020;

// Number of stereo samples being used (4 bytes)
constants['ADDR_NUM_STEREO_SAMPLES'] = 0x001B0024;

// Current offset
constants['ADDR_CURRENT_OFFSET'] = 0x001B0028;

// 0x001B002C -> 0x001B0100 (212 unknown bytes) - likely all null
// 4 bytes
constants['ADDR_DISK_SPACE'] = 0x001B0028;

// 256 mono sample headers at 40 bytes each
constants['ADDR_SAMPLE_HEADER_MONO'] = 0x001B0100;

// 128 stereo sample headers at 44 bytes each
constants['ADDR_SAMPLE_HEADER_STEREO'] = 0x001B2900;

constants['ADDR_UNKNOWN_SECTION_4'] = 0x001B3F00;
constants['ADDR_SLICE_DATA'] = 0x001B4200;
constants['ADDR_SAMPLE_DATA'] = 0x00250000;

constants['CHUNKSIZE_GLOBAL_PARAMETERS'] = 192;
constants['CHUNKSIZE_PATTERN'] = 4280;
constants['CHUNKSIZE_SONG'] = 528;
constants['CHUNKSIZE_SONG_EVENT'] = 8;
constants['CHUNKSIZE_SAMPLE_HEADER_MONO'] = 40;
constants['CHUNKSIZE_SAMPLE_HEADER_STEREO'] = 44;
constants['CHUNKSIZE_PARAMETERS_FX'] = 4;
constants['CHUNKSIZE_PARAMETERS_MOTION'] = 130;
constants['CHUNKSIZE_PARTS_DRUM'] = 34;
constants['CHUNKSIZE_PARTS_KEYBOARD'] = 274;
constants['CHUNKSIZE_PARTS_STRETCHSLICE'] = 32;
constants['CHUNKSIZE_PARTS_ACCENT'] = 18;
constants['CHUNKSIZE_PARTS_AUDIOIN'] = 156;
constants['CHUNKSIZE_SLICE_DATA'] = 2048;

constants['NUM_MIDI_CHANNELS'] = 3;
constants['NUM_PART_NOTE_NUMBERS'] = 13;
constants['NUM_MIDI_CONTROL_CHANGE_ASSIGNMENTS'] = 33;
constants['NUM_PATTERN_SET_PARAMETERS'] = 128;
constants['NUM_PATTERNS'] = 256;
constants['NUM_SONGS'] = 64;
constants['NUM_SONG_PATTERNS'] = 256;
constants['NUM_SAMPLES_MONO'] = 256;
constants['NUM_SAMPLES_STEREO'] = 128;
constants['NUM_SAMPLES'] = constants.NUM_SAMPLES_MONO + constants.NUM_SAMPLES_STEREO;
constants['NUM_PARAMETERS_FX'] = 3;
constants['NUM_PARAMETERS_MOTION'] = 24;
constants['NUM_MOTION_OPERATIONS'] = 128;
constants['NUM_PARTS'] = 16;
constants['NUM_PARTS_DRUM'] = 9;
constants['NUM_PARTS_KEYBOARD'] = 2;
constants['NUM_PARTS_STRETCHSLICE'] = 3;
constants['NUM_PARTS_ACCENT'] = 1;
constants['NUM_PARTS_AUDIOIN'] = 1;
constants['NUM_SEQUENCE_DATA'] = 16;
constants['NUM_SEQUENCE_DATA_GATE'] = 128;
constants['NUM_SEQUENCE_DATA_NOTE'] = 128;
constants['NUM_SLICE_DATA'] = 256;

// constants['MAX_NUM_SAMPLES'] = 12582911;
constants['MAX_SAMPLE_MEM_IN_FRAMES'] = 0xC00000;
constants['MAX_SAMPLE_MEM_IN_BYTES'] = constants.MAX_SAMPLE_MEM_IN_FRAMES * 2;
constants['MAX_SAMPLE_MEM_IN_SECONDS'] = constants.MAX_SAMPLE_MEM_IN_FRAMES / 44100;
constants['MAX_NUM_SONG_EVENTS'] = 20000;
constants['SIZE_FILE_MIN'] = 0x00250010;
constants['SIZE_FILE_MAX'] = constants.SIZE_FILE_MIN + constants.MAX_SAMPLE_MEM_IN_BYTES;

module.exports = constants;
