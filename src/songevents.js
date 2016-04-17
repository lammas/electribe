'use strict';

var Format = require('bin-format');
var Const = require('./constants');
var Utils = require('./utils');
var Common = require('./common');

class SongEventFlags {
	constructor(data) {
		this.data = data;
		this.measure = Utils.unpackInt(data, 4, 4);
		this.step = Utils.unpackInt(data, 4, 0);
	}

	serialize() {
		// TODO: pack
		return this.data;
	}
}

var ControlEvent = new Format()
	.uint8('reserved0')
	.uint8('value')
	.uint16BE('reserved1')
	;

var NoteEvent = new Format()
	.uint8('part')
	.uint8('note') // Only used for parts 10 and 11 (kb1, kb2)
	.uint16BE('length') // Only used for parts 10 and 11 (kb1, kb2)
	;

var TempoEvent = new Format()
	.uint16BE('reserved')
	.uint16BE('tempo', Common.Tempo)
	;


var MuteSoloEvent = new Format()
	.uint16BE('reserved')
	.uint16BE('status', Common.MuteSoloParameters)
	;


var SongEvent = new Format()
	.uint8('position') // 0~255 : 1~256
	.uint8('flags', SongEventFlags)
	.uint16BE('operation')
	.custom('data', function(state) {
		switch (state.operation) {
			case 0x4000:
				return NoteEvent;
			case 515:
				return TempoEvent;
			case 503:
				return MuteSoloEvent;
			default:
				return ControlEvent;
		}
	});

class SongEvents {
	constructor(data) {
		this.data = data;
		this.formats = [];
		this.songs = [];
	}

	parse(songs) {
		var position = 0;
		for (var i=0; i<songs.length; i++) {
			var fmt = new Format();
			if (songs[i].numsongevents > 0) {
				fmt.list('events', songs[i].numsongevents, SongEvent);
				var length = songs[i].numsongevents * Const.CHUNKSIZE_SONG_EVENT;
				var eventData = this.data.slice(position, position + length);
				position += length;
				this.songs.push(fmt.parse(eventData));
			}
			else {
				this.songs.push({});
			}
			this.formats.push(fmt);
		}
	}

	serialize() {
		// TODO: pack
		return this.data;
	}
}

module.exports = SongEvents;
