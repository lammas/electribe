'use strict';

var Format = require('bin-format');
var Const = require('./constants');
var Utils = require('./utils');
var Common = require('./common');

class SongEventFlags {
	constructor(data) {
		this.measure = Utils.unpackInt(data, 4, 4);
		this.step = Utils.unpackInt(data, 4, 0);
	}

	serialize() {
		var value = 0;
		value = Utils.packInt(value, this.measure, 4, 4);
		value = Utils.packInt(value, this.step, 4, 0);
		return value;
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
			if (songs[i].numsongevents == 0)
				continue;

			var fmt = new Format();
			fmt.list('events', songs[i].numsongevents, SongEvent);
			this.formats.push(fmt);

			var length = songs[i].numsongevents * Const.CHUNKSIZE_SONG_EVENT;
			var eventData = this.data.slice(position, position + length);
			position += length;
			this.songs.push(fmt.parse(eventData));
		}
	}

	serialize() {
		if (this.formats.length != this.songs.length)
			throw Error('Song count does not match event list formats count');

		var data = Buffer.alloc(this.data.length, 0);
		var position = 0;
		for (var i = 0; i < this.formats.length; ++i) {
			var fmt = this.formats[i];
			var song = this.songs[i];
			var eventData = fmt.write(song);
			eventData.copy(data, position);
			position += eventData.length;
		}
		return data;
	}
}

module.exports = SongEvents;
