<template>
	<div class="tetris">
		<Players></Players>
		<TetrisBoard></TetrisBoard>
		<div class="next">
			<NextPiece v-for="piece in store.me.next" :piece="piece"></NextPiece>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import TetrisBoard from './Tetris/TetrisBoard.vue';
import Players from './Tetris/Players.vue';
import NextPiece from './Tetris/NextPiece.vue';
import { useGameStore } from '../stores/game';
const store = useGameStore();


const props = defineProps(['socket'])

const bindKeys = (event) => {
	if (event.code === "ArrowLeft") {
		props.socket.emit("move", -1);
	} else if (event.code === "ArrowRight") {
		props.socket.emit("move", 1);
	} else if (event.code === "ArrowDown") {
		props.socket.emit("drop");
	} else if (event.code === "KeyQ") {
		props.socket.emit("rotate", -1);
	} else if (event.code === "KeyW" || event.code === "ArrowUp") {
		props.socket.emit("rotate", 1);
	} else if (event.code === "Space") {
		props.socket.emit("hardDrop");
	}
}

onMounted(() => {
	document.addEventListener("keydown", bindKeys);
})

onUnmounted(() => {
	document.removeEventListener('keydown', bindKeys);
})

</script>


<style lang="scss">
.tetris {
	display: grid;
	grid-template-columns: 30% auto 120px;
	gap: 10px;
}
</style>
