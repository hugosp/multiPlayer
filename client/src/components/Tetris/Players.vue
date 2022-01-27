<script setup>
import SmallBoard from './SmallBoard.vue'
import { useGameStore } from '../../stores/game';

const store = useGameStore();

</script>


<template>
	<div class="players">
		<div
			class="player"
			v-for="player in store.playersInRoom.filter(p => p.id != store.me.id)"
			:key="player.id || 'gameover'"
		>
			<div v-if="!player.id">Player left...</div>

			<div v-else>
				<SmallBoard :player="player"></SmallBoard>
				<div class="info">
					<strong style="grid-column: span 2;">{{ player.name }}</strong>
					<span>Score:</span>
					<span>{{ player.score }}</span>
					<span>Lines:</span>
					<span>{{ player.lines }}</span>
					<span>Level:</span>
					<span>{{ player.level }}</span>
				</div>
			</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.players {
	display: grid;
	grid-template-columns: repeat(auto-fill, 100px);
	grid-auto-rows: 255px;
	gap: 5px;
	.player {
		padding: 2px;
		border: 1px solid #aaa;
		border-radius: 5px;
		text-align: center;
		.info {
			display: grid;
			grid-template-columns: min-content auto;
			strong {
				border-bottom: 1px solid #aaa;
				padding-bottom: 2px;
			}
		}
	}
}
</style>
