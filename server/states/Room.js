class Room {
	constructor(roomID, clientID, options) {
		this.id = roomID;
		this.name = options.name;
		this.hostID = clientID;

		this.maxPlayers = options.maxPlayers || 10;

		this.clients = [];
		this.chat = [];

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

