const { io } = require("../lib/Server");

class EventModel {
	constructor(io, players, rooms) {
		this.io = io;
		this.players = players;
		this.rooms = rooms;
	}

	broadcastDebugMsg(msg) {
		this.io.sockets.emit('debugMessage', msg);
	}

	findRoomByID(clientID) {
		const room = Object.values(this.rooms).filter(r => r.clients.includes(clientID) || r.hostID == clientID) || null;
		if (room.length) {
			return room[0];
		}
	}

	emitToRoom(roomID, msg, data = {}) {
		io.to(roomID).emit(msg, data)
	}

}

module.exports = EventModel
