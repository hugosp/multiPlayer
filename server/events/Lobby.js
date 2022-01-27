const EventModel = require('./EventModel');

const uuid = require('node-uuid');
const Player = require('../game/Player');
const Room = require('../game/Room');

class Lobby extends EventModel {

	connect(socket) {
		console.log('a user connected', socket.id);
		this.players[socket.id] = new Player(socket, socket.handshake.query);
		this.sendUpdate(true, socket);
		this.broadcastDebugMsg(socket.id + ' has joined the server');
	}

	disconnect(socket) {
		if (this.players[socket.id].isHost) {
			const room = this.findRoomByID(socket.id);
			if (room) {
				this.broadcastDebugMsg('Host has left room: ' + room.name);
				delete this.rooms[room.id];
			}
			this.sendUpdate()
		}
		this.broadcastDebugMsg(socket.id + ' has disconnected from the server');
		delete this.players[socket.id];
	}

	chat(socket, msg) {
		var room = this.findRoomByID(socket.id, this.rooms);
		this.rooms[room.id].addChatMsg(this.players[socket.id], msg);
		this.sendUpdate()
	}


	changeName(socket, name) {
		this.players[socket.id].name = name;
		this.sendUpdate()
	}


	async connectClientToRoom(socket, options, isHost, callback) {

		const roomID = isHost ? uuid.v4() : options.id;
		// om spelaren redan är i ett rum
		if (this.players[socket.id].isHost || this.players[socket.id].room) {
			return false;
		}

		await socket.join(roomID)

		this.players[socket.id].isHost = isHost;
		this.players[socket.id].room = roomID;

		if (isHost) {
			this.rooms[roomID] = new Room(roomID, socket.id, options);
			this.broadcastDebugMsg(socket.id + ' has created room: ' + options.name);
		} else {
			this.rooms[roomID].addClient(socket.id);
			this.broadcastDebugMsg(socket.id + ' has joined room: ' + this.rooms[roomID].name);
		}
		this.sendUpdate()

		callback(roomID);
		return true;
	}

	sendUpdate(onlyMe = false, socket = {}) {
		const players = {};
		Object.values(this.players).forEach(p => {
			players[p.id] = p.getData();
		})
		const data = { rooms: this.rooms, players: players };
		if (onlyMe) {
			socket.emit('update', data);
		}
		this.io.sockets.emit('update', data);
	}




}

module.exports = Lobby
