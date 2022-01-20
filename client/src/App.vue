
<template>
	<section class="main">
		<div class="in-room" v-if="store.roomId">
			<h3>ROOM: {{ store.currentRoom.name }}</h3>
			<Chat :socket="socket"></Chat>
		</div>

		<div class="right" v-else>
			<button @click="createRoom">Create room</button>
			<hr />
			<h3>ROOMS</h3>

			<div v-for="room in store.rooms" class="roomlist">
				<span>{{ room.name }}</span>
				<span>( {{ (room.clients.length + 1) }} )</span>
				<button @click="joinRoom(room)">Join room</button>
			</div>
		</div>
	</section>

	<h4>DebugLog</h4>
	<section class="debug">
		<p v-for="row in store.debug">{{ row }}</p>
	</section>

	<details>
		<summary>Store</summary>
		<pre><code>{{ store }}</code></pre>
	</details>
</template>

<script setup>

import Chat from './components/Chat.vue';
import { useGameStore } from './stores/game';
const store = useGameStore();

const socket = new io('ws://localhost:8080', {
	query: {
		name: store.name,
	}
});

const createRoom = () => {
	const name = prompt('name');
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
.roomlist {
	width: 100%;
	display: grid;
	grid-template-columns: auto 50px 250px;
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
// .main {
// 	display: grid;
// 	gap: 10px;
// 	grid-template-columns: auto 300px;
// }
.debug {
	max-height: 100px;
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
