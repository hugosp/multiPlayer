const EventModel = require('./EventModel');

class Game extends EventModel {

	start(socket, options) {
		console.log('START GAME');
		const room = this.findRoomByID(socket.id);

		this.broadcastDebugMsg('Game started in room: ' + room.name);
		this.emitToRoom(room.id, 'startGame')

		// host
		this.players[socket.id].reset();
		// the rest
		room.clients.forEach(id => {
			this.players[id].reset();
		});


		this.sendState(room.id);
	}

	sendState(roomID) {
		const players = {};
		Object.values(this.players).forEach(p => {
			players[p.id] = p.getData();
		})
		const data = { rooms: this.rooms, players: players };
		this.emitToRoom(roomID, 'update', data);
	}

	move(socket, dir) {
		this.players[socket.id].move(dir);
		socket.emit('updateMe', this.players[socket.id].getData());
	}
	rotate(socket, dir) {
		this.players[socket.id].rotate(dir);
		socket.emit('updateMe', this.players[socket.id].getData());
	}
	drop(socket, dir) {
		// if newline
		if (this.players[socket.id].drop(dir)) {
			this.sendState(this.findRoomByID(socket.id).id);
		} else {
			socket.emit('updateMe', this.players[socket.id].getData());
		}
	}
	hardDrop(socket, dir) {
		// if newline
		if (this.players[socket.id].hardDrop(dir)) {
			this.sendState(this.findRoomByID(socket.id).id);
		} else {
			socket.emit('updateMe', this.players[socket.id].getData());
		}
	}


}

module.exports = Game
