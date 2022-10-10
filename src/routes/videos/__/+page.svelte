<script lang="ts">
	import { goto } from '$app/navigation';
	import { setVideo } from '$lib/firebase/db';
	import { getBeforeContent, getSuggestionsInContent } from '$lib/utility';
	import { event } from '$lib/state';
	import Caption from '$lib/Caption.svelte';
	import Connections from '$lib/Connections.svelte';

	let title = '';
	let caption = '';
	$: connection = getBeforeContent(caption, $event);
	$: suggestions = getSuggestionsInContent(caption, $event);
	let video: FileList;
	let loading = false;
	let err: any;
	$: ok = !loading && title && caption && video && video.length === 1;
	async function createVideo() {
		loading = true;
		try {
			const videoID = await setVideo(undefined, {
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
				video: video[0]
			});
			goto('/videos/' + videoID);
		} catch (e) {
			err = e;
			console.error(e);
			loading = false;
		}
	}
</script>

<Caption bind:caption {suggestions} />
<form on:submit|preventDefault={createVideo}>
	<div class="field">
		<label for="title">Title</label>
		<input id="title" bind:value={title} />
		{#if !title}
			<p class="err">Enter a Title</p>
		{/if}
	</div>
	<div class="field">
		<label for="display-image">Display Video</label>
		<input bind:files={video} type="file" id="display-image" />
		{#if !video || video.length !== 1}
			<p class="err">Select a Display Image</p>
		{/if}
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
<Connections {connection} />
