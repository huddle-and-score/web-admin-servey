<script lang="ts">
	import { news, event } from '$lib/state';
	import { page } from '$app/stores';
</script>

<h1 class="text-2xl underline">News</h1>

<a
	class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
	href="/event/{$page.params.eventID}/news/__"
>
	➕ Create News
</a>

{#each $news as n}
	<a
		href="/event/{$page.params.eventID}/news/{n.id}"
		class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl overflow-hidden"
	>
		<img alt={n.id} class="p-1 mx-4 w-14 h-14 ring-2 ring-white" src={n.image} />
		<div>
			{#each n.content as val}
				{#if val.type === 'text'}
					<span>{val.text}</span>
				{:else if val.type === 'player'}
					<span />
					<span class="text-pink-700">
						@{$event.players[val.playerID]?.jerseyNum ?? val.playerID}
					</span>
					<span />
				{:else}
					<span />
					<span class="text-pink-700">
						#{$event.teams[val.teamID]?.acronym ?? val.teamID}
					</span>
					<span />
				{/if}
			{/each}
		</div>
	</a>
{/each}
