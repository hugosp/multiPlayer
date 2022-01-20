


class Player {
	constructor(socket, options) {
		this.id = socket.id;
		this.name = options.name || '';

		this.isHost = false;
		this.room = null;
		this.color = '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);

		// this.socket = socket;

		this.position = {
			x: 0,
			y: 0,

		}
	}
}
module.exports = Player

