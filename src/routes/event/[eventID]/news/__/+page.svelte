<script lang="ts">
	import { goto } from '$app/navigation';
	import { setNews } from '$lib/firebase/db';
	import { getBeforeContent, getSuggestionsInContent } from '$lib/utility';
	import { event } from '$lib/state';
	import Caption from '$lib/Caption.svelte';
	import Connections from '$lib/Connections.svelte';
	import { page } from '$app/stores';

	let title = '';
	let caption = '';
	$: connection = getBeforeContent(caption, $event);
	$: suggestions = getSuggestionsInContent(caption, $event);
	let image: FileList;
	let loading = false;
	let err: any;
	$: ok = !loading && title && caption && image && image.length === 1;
	async function createNews() {
		loading = true;
		try {
			const newsID = await setNews($page.params.eventID, undefined, {
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
				image: image[0]
			});
			goto('/event/' + $page.params.eventID +'/news/' + newsID);
		} catch (e) {
			err = e;
			console.error(e);
			loading = false;
		}
	}
</script>

<Caption bind:caption {suggestions} />
<form on:submit|preventDefault={createNews}>
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
		{#if !image || image.length !== 1}
			<p class="err">Select a Display Image</p>
		{/if}
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
<Connections {connection} />
