<script lang="ts">
	import { page } from '$app/stores';
	import { videos, event } from '$lib/state';
	import { setVideo } from '$lib/firebase/db';
	import { getBeforeContent, getSuggestionsInContent } from '$lib/utility';
	import { onMount } from 'svelte';
	import Caption from '$lib/Caption.svelte';
	import Connections from '$lib/Connections.svelte';

	$: videoID = $page.params.videoID;
	$: video = $videos.find((x) => x.id === videoID)!;
	$: videoCaption = video.content
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
	let videoFile: FileList | undefined;
	let loading = false;
	let err: any;
	$: ok = !loading && caption && (caption !== videoCaption || videoFile?.length === 1);
	onMount(function () {
		title = video.title;
		caption = videoCaption;
	});
	async function updateVideo() {
		loading = true;
		try {
			await setVideo($page.params.eventID, videoID, {
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
				video: videoFile?.[0] ?? video.video
			});
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<Caption bind:caption {suggestions} />
<form on:submit|preventDefault={updateVideo}>
	<div class="field">
		<label for="title">Title</label>
		<input id="title" bind:value={title} />
		{#if !title}
			<p class="err">Enter a Title</p>
		{/if}
	</div>
	<div class="field">
		<label for="display-videoFile">Display Video</label>
		<input bind:files={videoFile} type="file" id="display-videoFile" />
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
<Connections {connection} />
