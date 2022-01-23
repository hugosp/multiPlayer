const EventModel = require('./EventModel');

class Game extends EventModel {

	start(socket, options) {
		console.log('START GAME');
		const room = this.findRoomByID(socket.id);

		room.isRunning = true;
		room.startTime = (new Date).getTime();

		this.broadcastDebugMsg('Game started in room: ' + room.name);
		this.emitToRoom(room.id, 'startGame')

		// host
		this.players[socket.id].reset();
		// the rest
		room.clients.forEach(id => {
			this.players[id].reset();
		});

		this.sendState(room.id);

		setInterval(() => this.gameLoop(room.id), 1000 / 30);
	}

	gameLoop(roomID) {

		const room = this.rooms[roomID];

		// if room has closed
		if (!room) {
			clearInterval(() => this.gameLoop(roomID));
			return;
		}

		// if only one player alive
		const alive = room.playersIds().filter(id => this.players[id].isKilled === false);

		if (alive.length === 1) {
			clearInterval(() => this.gameLoop(roomID));
			this.emitToRoom(room.id, 'winner', { id: alive[0] })
			return;
		}

		const time = (new Date).getTime();
		const deltaTime = time - room.lastUpdate;

		let modified = false;
		room.playersIds().forEach(id => {
			// check player still in game
			if (this.players[id] && !this.players[id].isKilled) {
				this.players[id].dropCounter += deltaTime;
				// dropFPS
				if (this.players[id].dropCounter > this.players[id].dropInterval) {
					this.players[id].drop();
					this.players[id].dropCounter = 0;
					modified = true;
				}
			}
		});
		if (modified) {
			this.sendState(room.id);
		}

		room.lastUpdate = time;
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
