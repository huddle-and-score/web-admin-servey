<script lang="ts">
	import { videos, event } from '$lib/state';
</script>

<h1 class="text-2xl underline">Video</h1>

<a
	class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
	href="/videos/__"
>
	➕ Create
</a>

{#each $videos as video}
	<a
		href="/videos/{video.id}"
		class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl overflow-hidden"
	>
		{#each video.content as val}
			{#if val.type === 'text'}
				<span>{val.text}</span>
			{:else if val.type === 'player'}
				<span />
				<a href="/players/{val.playerID}" class="underline text-pink-700">
					@{$event.players[val.playerID]?.jerseyNum ?? val.playerID}
				</a>
				<span />
			{:else}
				<span />
				<a href="/teams/{val.teamID}" class="underline text-pink-700">
					#{$event.teams[val.teamID]?.acronym ?? val.teamID}
				</a>
				<span />
			{/if}
		{/each}
	</a>
{/each}
