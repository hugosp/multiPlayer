import { defineStore } from 'pinia'

const name = 'Player' + Math.floor((Math.random() * 10000) + 1000);

export const useGameStore = defineStore('game', {
	state: () => {
		return {
			name: name,
			socketId: null,
			roomId: null,
			gameStarted: false,

			debug: [],
			rooms: {},
			players: {},

			game: {},
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
			this.rooms = payload.rooms || {};
			this.players = payload.players || {};

			if (!this.rooms[this.roomId]) {
				this.roomId = null;
				this.gameStarted = false;
			}
		},
		updateMe(payload) {
			this.players[payload.id] = payload;
		},
		updateGameState(state) {
			this.gameStarted = state;
		}
	},
	getters: {
		me() {
			return this.players[this.socketId];
		},
		currentRoom() {
			return this.rooms[this.roomId] || {};
		},
		playersInRoom() {
			if (!this.currentRoom.id) {
				return [];
			}

			return [
				this.players[this.currentRoom.hostID],
				...this.currentRoom.clients.map(id => this.players[id])
			]
		}
	}
})
