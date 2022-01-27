const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');

app.use(express.static(path.join(__dirname, '/../../client/dist')));

const io = new Server(server, {
	// Development CORS with vite
/*	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"]
	}*/
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, function () {
	console.log(`listening on localhost:${PORT}`);
});

exports.app = app;
exports.io = io;

