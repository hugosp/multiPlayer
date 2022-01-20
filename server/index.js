const uuid = require('node-uuid');
const { io } = require('./lib/Server');
const Player = require('./states/Player');
const Room = require('./states/Room');
const Lobby = require('./events/Lobby');

const rooms = {}
const players = {}

const lobby = new Lobby(io, players, rooms);

io.on('connection', (socket) => {
	console.log('a user connected', socket.id);
	players[socket.id] = new Player(socket, socket.handshake.query);

	socket.emit('update', rooms);
	broadcastDebugMsg(socket.id + ' has joined the server');


	socket.on('join', (options, callback) => connectClientToRoom(options, socket.id, false, callback));
	socket.on('host', (options, callback) => connectClientToRoom(options, socket.id, true, callback));

	socket.on('chatMessage', function (msg) {
		var room = findRoomByID(socket.id, rooms);
		rooms[room.id].addChatMsg(players[socket.id], msg);
		io.sockets.emit('update', rooms);
	});

	socket.on('disconnect', () => {
		if (players[socket.id].isHost) {
			const room = findRoomByID(socket.id, rooms);
			if (room) {
				broadcastDebugMsg('Host has left room: ' + room.name);
				delete rooms[room.id];
			}
			io.sockets.emit('update', rooms);
		}

		broadcastDebugMsg(socket.id + ' has disconnected from the server');
		delete players[socket.id];
	});

	async function connectClientToRoom(options, clientID, isHost, callback) {
		const roomID = isHost ? uuid.v4() : options.id;
		// om spelaren redan är i ett rum
		if (players[clientID].isHost || players[clientID].room) {
			return false;
		}

		await socket.join(roomID)

		players[clientID].isHost = isHost;
		players[clientID].room = roomID;

		if (isHost) {
			rooms[roomID] = new Room(roomID, clientID, options);
			broadcastDebugMsg(clientID + ' has created room: ' + options.name);
		} else {
			rooms[roomID].addClient(clientID);
			broadcastDebugMsg(clientID + ' has joined room: ' + rooms[roomID].name);
		}
		io.sockets.emit('update', rooms);

		callback(roomID);
		return true;
	}

	function broadcastDebugMsg(msg) {
		io.sockets.emit('debugMessage', msg);
	}

	function findRoomByID(clientID, rooms) {
		const room = Object.values(rooms).filter(r => r.clients.includes(clientID) || r.hostID == clientID) || null;
		if (room.length) {
			return room[0];
		}
	}
})
