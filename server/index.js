const { io } = require('./lib/Server');
const Lobby = require('./events/Lobby');
const Game = require('./events/Game');

const rooms = {}
const players = {}

const lobby = new Lobby(io, players, rooms);
const game = new Game(io, players, rooms);


io.on('connection', (socket) => {

	lobby.connect(socket);
	// Lobby events
	socket.on('join', (options, callback) => lobby.connectClientToRoom(socket, options, false, callback));
	socket.on('host', (options, callback) => lobby.connectClientToRoom(socket, options, true, callback));
	socket.on('chatMessage', (msg) => lobby.chat(socket, msg));
	socket.on('changeName', (name) => lobby.changeName(socket, name));

	socket.on('disconnect', () => game.disconnect(socket).then(() => lobby.disconnect(socket)));

	// Game events
	socket.on('startGame', (options) => game.start(socket, options));
	socket.on('move', (data) => game.move(socket, data));
	socket.on('drop', (data) => game.drop(socket, data));
	socket.on('rotate', (data) => game.rotate(socket, data));
	socket.on('hardDrop', (data) => game.hardDrop(socket, data));
})
