<script lang="ts">
	import { page } from '$app/stores';
	import { news as newsStore, event } from '$lib/state';
	import { setNews } from '$lib/firebase/db';
	import { getBeforeContent, getSuggestionsInContent } from '$lib/utility';
	import { onMount } from 'svelte';
	import Caption from '$lib/Caption.svelte';
	import Connections from '$lib/Connections.svelte';

	$: newsID = $page.params.newsID;
	$: news = $newsStore.find((x) => x.id === newsID)!;
	$: newsCaption = news.content
		.map((x) => {
			if (x.type === 'text') return x.text;
			if (x.type === 'team') return '@' + ($event.teams[x.teamID]?.acronym ?? x.teamID);
			const player = $event.players[x.playerID];
			if (!player) return '@' + x.playerID;
			return '@' + player.team.acronym + player.jerseyNum;
		})
		.join('');

	let title = '';
	let caption = '';
	$: connection = getBeforeContent(caption, $event);
	$: suggestions = getSuggestionsInContent(caption, $event);
	let image: FileList | undefined;
	let loading = false;
	let err: any;
	$: ok =
		!loading &&
		title &&
		caption &&
		(title !== news.title || caption !== newsCaption || image?.length === 1);
	onMount(function () {
		title = news.title;
		caption = newsCaption;
	});
	async function updateNews() {
		loading = true;
		try {
			await setNews($page.params.eventID, newsID, {
				title,
				caption: connection
					.map((x) =>
						x.type === 'text'
							? x.text
							: x.type === 'player'
							? ` @${x.player.id} `
							: ` #${x.team.id} `
					)
					.join(''),
				connectionIDs: connection
					.filter((x) => x.type !== 'text')
					.map((x) => (x.type === 'player' ? x.player.id : x.type === 'team' ? x.team.id : '')),
				image: image?.[0] ?? news.image
			});
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<Caption bind:caption {suggestions} />
<form on:submit|preventDefault={updateNews}>
	<div class="field">
		<label for="title">Title</label>
		<input id="title" bind:value={title} />
		{#if !title}
			<p class="err">Enter a Title</p>
		{/if}
	</div>
	<div class="field">
		<label for="display-image">Display Image</label>
		<input bind:files={image} type="file" id="display-image" />
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
<Connections {connection} />
