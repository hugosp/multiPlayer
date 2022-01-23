
<template>
	<div class="app">
		<section class="main" v-if="!store.gameStarted">
			<div class="info">
				<h1>T3TRiS</h1>
				<h3 v-if="store.name">PLAYER: {{ store.name }}</h3>
				<h3 v-if="store.currentRoom.name">ROOM: {{ store.currentRoom.name }}</h3>
				<button @click="createRoom" v-if="!store.roomId">Create room</button>
				<button @click="startGame" v-if="store.roomId && store.me.isHost">Start Game</button>
			</div>
			<hr />
			<div class="in-room" v-if="store.roomId">
				<Chat :socket="socket"></Chat>
			</div>

			<div class="right" v-else>
				<h3>ROOMS</h3>

				<div v-if="Object.values(store.rooms).length" v-for="room in store.rooms" class="roomlist">
					<span>{{ room.name }}</span>
					<span>( {{ (room.clients.length + 1) }} / {{ room.maxPlayers }} )</span>
					<button v-if="room.isRunning" disabled>Game running</button>
					<button v-else @click="joinRoom(room)">Join room</button>
				</div>
				<div v-else class="roomlist">
					<span>Currently no rooms...</span>
					<span></span>
					<span></span>
				</div>
			</div>
		</section>

		<section class="game" v-if="store.gameStarted">
			<Tetris :socket="socket"></Tetris>
		</section>

		<section class="debug">
			<p v-for="row in store.debug">{{ row }}</p>
		</section>
	</div>
</template>

<script setup>

import Chat from './components/Chat.vue';
import Tetris from './components/Tetris.vue';
import { useGameStore } from './stores/game';
const store = useGameStore();

const socket = new io('ws://localhost:8080', {
	query: {
		name: store.name,
	}
});

const createRoom = () => {
	const name = prompt('name', Math.floor(Math.random() * 1000) + 1000);
	socket.emit('host', { name: name, maxPlayers: 8 }, (roomID) => {
		console.log('created room callback', roomID)
		store.setRoomId(roomID);
	});
}

const joinRoom = (room) => {
	socket.emit('join', { id: room.id }, (roomID) => {
		console.log('created room callback', roomID)
		store.setRoomId(roomID);
	});
}

const startGame = () => {
	socket.emit('startGame');
}


socket.on('connect', (msg) => {
	console.log('connect', msg)
	store.setSocketId(socket.id);
	store.setRoomId(null);
});

socket.on('debugMessage', data => {
	store.debugMessage(data);
	console.log('debugMessage', data);
})

socket.on('update', data => {
	store.update(data);
	console.log('update', data);
})

socket.on('updateMe', data => {
	store.updateMe(data);
	console.log('updateMe', data);
})


socket.on('startGame', () => {
	store.updateGameState(true);
})

socket.on('winner', (data) => {
	console.log('WINNER', data);
	store.setWinner(data);
})


</script>




<style lang="scss">
@import url("https://cdn.jsdelivr.net/npm/water.css@2/out/water.min.css");
body {
	max-width: 90vw;
}
header {
	text-align: center;
	margin-bottom: 40px;
}
.app {
	height: 95vh;
	display: grid;
	grid-template-rows: auto 100px;
}
.roomlist {
	width: 100%;
	display: grid;
	grid-template-columns: auto 80px 250px;
	backdrop-filter: brightness(0.8);
	padding: 5px;
	border-radius: 6px;
	gap: 10px;
	padding: 10px 5px;
	span,
	button {
		margin-top: auto;
		margin-bottom: auto;
	}
	margin-bottom: 10px;
}
.main {
	.info {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 200px;
		gap: 10px;
		align-items: center;
		h1 {
			margin: 0;
			padding: 0;
		}
		h3 {
			margin-left: auto;
		}
		button {
			grid-column: 4/5;
		}
	}
	.in-room {
		height: calc(100% - 50px);
	}
}
.debug {
	overflow-y: auto;
	backdrop-filter: brightness(0.8);
	padding: 5px;
	border-radius: 6px;
	p {
		margin: 0;
		padding: 0;
		line-height: 12px;
		font-size: 10px;
	}
}
</style>
