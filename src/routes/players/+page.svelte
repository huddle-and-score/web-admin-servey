<script lang="ts">
	import { event } from '$lib/state';
</script>

<h1 class="text-2xl underline">Players</h1>

<a
	class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
	href="/players/__"
>
	➕ Create Player
</a>

{#each $event.sortedPlayers as player}
	<a
		href="/players/{player.id}"
		class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
	>
		<div class="w-2 h-20 -mt-3" style="background-color: {player.team.color}" />
		<img
			alt={player.name}
			class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
			src={player.displayImage}
		/>
		<div class="flex justify-between w-full">
			<div>
				<span class="block">
					{player.name}
				</span>
				<span class="block">
					{player.team.acronym}
				</span>
			</div>
			<span>
				{player.points}
			</span>
		</div>
	</a>
{/each}
