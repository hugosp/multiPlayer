<script setup>
import SmallBoard from './SmallBoard.vue'
import { useGameStore } from '../../stores/game';

const store = useGameStore();

// const sortedPlayers = Object.values(store.playersInRoom).sort((a, b) => a.id.localeCompare(b.id))

</script>


<template>
	<div class="players">
		<div class="player" v-for="player in store.playersInRoom" :key="player.id">
			<h3>{{ player.name }} - {{ player.score }}</h3>
			<SmallBoard :player="player"></SmallBoard>
		</div>
	</div>
</template>


<style lang="scss" scoped>
</style>
