<script setup>
import { ref, onMounted } from 'vue';
import { colors } from '../../settings';

const props = defineProps(['piece'])

const canvas = ref(null)
const context = ref(null)

onMounted(() => {
	draw();
})

const draw = () => {
	// canvas.value.width = props.piece[0].length * 20
	// canvas.value.height = props.piece.length * 20

	context.value = canvas.value.getContext("2d");
	context.value.scale(20, 20);

	// context.value.fillStyle = "#000";
	// context.value.fillRect(0, 0, canvas.value.width, canvas.value.height);

	props.piece?.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.value.fillStyle = colors[value];
				context.value.fillRect(x, y, 1, 1);
			}
		});
	});
}


</script>


<template>
	<canvas width="70" height="70" ref="canvas"></canvas>
</template>


<style lang="scss" scoped>
canvas {
	width: 80px;
	height: 80px;
	border: 2px solid #fff;
	display: block;
	padding: 1rem;
}
</style>
