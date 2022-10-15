<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { setVideo } from '$lib/firebase/db';
	import { videos, event } from '$lib/state';
	import Changes from './changes.svelte';
	$: videoID = $page.params.videoID;
	$: video = $videos.find((x) => x.id === videoID);
	let loading = false;
	let err: any;
	async function deleteVideo() {
		if (!confirm('Are you sure, this will delete the object. Once deleted cant be recovered'))
			return;
		try {
			await setVideo($page.params.eventID, videoID, null);
			goto('/videos');
		} catch (e) {
			err = e;
			console.log(e);
		}
	}
</script>

{#if !video}
	No such Video found
{:else}
	<video src={video.video} controls autoPlay class="h-52 w-full m-auto">
		<track kind="captions" />
	</video>
	<p>
		{#each video.content as val}
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
		on:click={deleteVideo}
		class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
	>
		{loading ? 'Loading...' : 'Delete'}
	</button>
	<p class="err">{err ?? ''}</p>
{/if}
