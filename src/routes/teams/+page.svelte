<script lang="ts">
	import { event } from '$lib/state';
</script>

<h1 class="text-2xl underline">Teams</h1>

<a
	class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
	href="teams/__"
>
	➕ Create Team
</a>

{#each $event.sortedTeams as team}
	<a
		href="/teams/{team.id}"
		class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
	>
		<div class="w-2 h-20 -mt-3" style="background-color: {team.color}" />
		<img
			alt={team.name}
			class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
			src={team.logo}
		/>
		<div class="flex justify-between w-full">
			<div>
				<span class="block">
					{team.name}
				</span>
				<span class="block">
					{team.acronym}
				</span>
			</div>
			<span>
				{team.points}
			</span>
		</div>
	</a>
{/each}
