<script lang="ts">
	import { page } from '$app/stores';
	import { news as newsStore, event } from '$lib/state';
	import Changes from './changes.svelte';
	$: newsID = $page.params.newsID;
	$: news = $newsStore.find((x) => x.id === newsID);
</script>

{#if !news}
	No such News found
{:else}
	<img alt={news.id} class="p-1 mx-4 h-20 ring-2 ring-white" src={news.image} />
	<p>
		{#each news.content as val}
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
	</p>
	<Changes />
{/if}
