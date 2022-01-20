import { defineStore } from 'pinia'

const name = 'Player' + Math.floor((Math.random() * 10000) + 1000);

export const useGameStore = defineStore('game', {
	state: () => {
		return {
			name: name,
			socketId: null,
			roomId: null,

			debug: [],
			rooms: {},
		}
	},
	actions: {
		setSocketId(id) {
			this.socketId = id;
		},
		setRoomId(id) {
			this.roomId = id;
		},
		debugMessage(payload) {
			this.debug.unshift(payload);
		},
		update(payload) {
			this.rooms = payload;
			if (!payload[this.roomId]) {
				this.roomId = null;
			}
		},
	},
	getters: {
		currentRoom() {
			return this.rooms[this.roomId] || {};
		}
	}
})
