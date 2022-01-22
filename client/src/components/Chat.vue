<template>
	<div class="chat-wrapper">
		<div class="chat">
			<div class="chat-output">
				<div
					v-for="row in store.currentRoom.chat"
					class="chat-row"
					:class="[row.name == 'SERVER' ? 'system' : '']"
				>
					<span>{{ row.time }}</span>
					<strong>[ {{ row.name }} ]</strong>
					<span>{{ row.msg }}</span>
				</div>
			</div>
			<input type="text" v-model="chat.input" @keydown.enter="sendChat" />
		</div>
		<div class="players">
			<span
				v-for="player in store.playersInRoom"
				:class="[player.isHost ? 'host' : '']"
			>{{ player.name }} {{ player.isHost ? ' (Host)' : '' }}</span>
		</div>
	</div>
</template>


<script setup>
import { reactive } from 'vue';
import { useGameStore } from '../stores/game';

const props = defineProps(['socket'])

const store = useGameStore();

const chat = reactive({
	input: '',
})

const sendChat = () => {
	props.socket.emit('chatMessage', chat.input);
	chat.input = '';
}

</script>


<style lang="scss">
.chat-wrapper {
	height: inherit;
	display: grid;
	grid-template-columns: auto 200px;
	gap: 10px;
	.players {
		border: 2px solid #fff;
		display: grid;
		height: 100%;
		grid-auto-rows: 20px;
		.host {
			font-weight: bold;
		}
	}
}
.chat {
	height: 100%;
	display: grid;
	grid-template-rows: auto 45px;
	border: 2px solid #fff;
	.chat-output {
		overflow-y: auto;
		display: grid;
		grid-auto-rows: 20px;
		align-content: end;
		padding: 5px;
		.chat-row {
			display: grid;
			gap: 10px;
			grid-template-columns: 80px max-content auto;
			&.system {
				font-style: italic;
				filter: brightness(50%);
			}
		}
	}
}
</style>
