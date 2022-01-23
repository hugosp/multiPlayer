<script setup>

import { onMounted, ref, watchEffect } from 'vue';
import { colors } from '../../settings';

import { useGameStore } from '../../stores/game';
const store = useGameStore();


const canvas = ref(null)
const context = ref(null)



onMounted(() => {
	context.value = canvas.value.getContext("2d");
	context.value.scale(20, 20);
})

const clear = () => {
	context.value.fillStyle = "#000";
	context.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
}



const draw = (matrix, px = 0, py = 0) => {
	Array.from(matrix).forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.value.fillStyle = colors[value];
				context.value.fillRect(x + px, y + py, 1, 1);
			}
		});
	});
}

const render = () => {
	if (context.value && canvas.value) {
		clear();
		draw(store.me.arena)
		draw(store.me.block, store.me.x, store.me.y)
	}
}

watchEffect(() => {
	render();
})


</script>


<template>
	<div class="tetris">
		<div class="center winner" v-if="store.gameWinner.id === store.me.id">WINNER!</div>
		<div class="center looser" v-if="store.me.isKilled">LOOSER!</div>
		<canvas width="240" height="400" ref="canvas"></canvas>
	</div>
</template>


<style lang="scss" scoped>
canvas {
	// margin: auto;
	margin-top: 0;
	border: solid 0.2em #fff;
	// width: 40vw;
	height: 80vh;
}
.tetris {
	position: relative;
	.center {
		position: absolute;
		top: 50%;
		left: 15%;
		font-weight: bold;
		font-size: 5vw;
		transform: rotate(45deg) translate(-15%, -50%);
	}
}
</style>
