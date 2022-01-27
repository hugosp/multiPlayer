class Room {
	constructor(roomID, clientID, options) {
		this.id = roomID;
		this.name = options.name;
		this.hostID = clientID;

		this.isRunning = false;

		// gameloop
		this.startTime = 0;
		this.lastUpdate = 0;
		this.intervalID = 0;

		this.maxPlayers = options.maxPlayers || 10;

		this.clients = [];
		this.chat = [];

	}

	playersIds() {
		return [this.hostID, ...this.clients];
	}

	addClient(clientID) {
		this.clients.push(clientID);
	}
	addChatMsg(player, msg) {
		const d = new Date();
		this.chat.push({
			time: d.toLocaleTimeString(),
			name: player.name,
			msg
		})
	}
}
module.exports = Room

