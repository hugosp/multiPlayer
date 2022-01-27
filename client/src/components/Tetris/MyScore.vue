<template>
	<div class="me">
		<h2>{{ store.me.name }}</h2>
		<hr />
		<h3>Score: {{ store.me.score }}</h3>
		<h3>Lines: {{ store.me.lines }}</h3>
		<h3>Level: {{ store.me.level }}</h3>
	</div>
</template>

<script setup>
import { useGameStore } from '../../stores/game';
const store = useGameStore();

</script>

<style lang="scss">
.me {
	padding: 10px;
	h1,
	h2,
	h3 {
		padding: 0;
		margin: 0;
	}
	grid-column: span 3;
	border: 1px solid #fff;
}
</style>
