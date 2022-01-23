<script setup>

import { onMounted, ref, watch, watchEffect } from 'vue';
import { colors } from '../../settings';

const props = defineProps(['player'])

const canvas = ref(null)
const context = ref(null)

onMounted(() => {
	context.value = canvas.value.getContext("2d");
	context.value.scale(10, 10);
	render();
})

const clear = () => {
	context.value.fillStyle = "#000";
	context.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
}

const draw = (matrix, px = 0, py = 0) => {
	matrix?.forEach((row, y) => {
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
		draw(props.player.arena)
	}
}

watchEffect(() => {
	render();
})

</script>


<template>
	<canvas width="120" height="200" ref="canvas"></canvas>
</template>


<style lang="scss" scoped>
canvas {
	margin: auto;
	// border: solid 2px #fff;
	// width: 100%;
	height: 200px;
}
</style>
