<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { setNews } from '$lib/firebase/db';
	import { news as newsStore, event } from '$lib/state';
	import Changes from './changes.svelte';
	$: newsID = $page.params.newsID;
	$: news = $newsStore.find((x) => x.id === newsID);
	let loading = false;
	let err: any;
	async function deleteNews() {
		if (!confirm('Are you sure, this will delete the object. Once deleted cant be recovered'))
			return;
		try {
			await setNews($page.params.eventID, newsID, null);
			goto('/news');
		} catch (e) {
			err = e;
			console.log(e);
		}
	}
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
				<a
					href="/event/{$page.params.eventID}/players/{val.playerID}"
					class="underline text-pink-700"
				>
					@{$event.players[val.playerID]?.jerseyNum ?? val.playerID}
				</a>
				<span />
			{:else}
				<span />
				<a href="/event/{$page.params.eventID}/teams/{val.teamID}" class="underline text-pink-700">
					#{$event.teams[val.teamID]?.acronym ?? val.teamID}
				</a>
				<span />
			{/if}
		{/each}
	</p>
	<Changes />
	<button
		disabled={loading}
		on:click={deleteNews}
		class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
	>
		{loading ? 'Loading...' : 'Delete'}
	</button>
	<p class="err">{err ?? ''}</p>
{/if}
