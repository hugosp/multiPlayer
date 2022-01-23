<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { colors } from '../../settings';

const props = defineProps(['piece'])

const canvas = ref(null)
const context = ref(null)

onMounted(() => {
	context.value = canvas.value.getContext("2d");
	context.value.scale(20, 20);

	draw();
})

const clear = () => {
	context.value.fillStyle = "#000";
	context.value.fillRect(0, 0, canvas.value.width, canvas.value.height);
}

const draw = () => {

	if (context.value && canvas.value) {
		clear();
		props.piece?.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					context.value.fillStyle = colors[value];
					context.value.fillRect(x, y, 1, 1);
				}
			});
		});
	}
}

watchEffect(() => {
	console.log('next pices')
	draw();
})


</script>


<template>
	<div class="next">
		<canvas width="70" height="70" ref="canvas"></canvas>
	</div>
</template>


<style lang="scss" scoped>
.next {
	background: #000;
	border: 2px solid #fff;
	text-align: center;
	canvas {
		width: 70px;
		height: 70px;
		padding: 1rem;
	}
}
</style>
