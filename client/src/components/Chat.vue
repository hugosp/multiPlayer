<template>
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
.chat {
	height: 30vh;
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
