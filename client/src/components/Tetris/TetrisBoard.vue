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
	<canvas with="240" height="400" ref="canvas"></canvas>
</template>


<style lang="scss" scoped>
canvas {
	margin: auto;
	border: solid 0.2em #fff;
	// width: 100%;
	height: 80vh;
}
</style>
