<script lang="ts">
	import { page } from '$app/stores';
	import { videos, event } from '$lib/state';
	import Changes from './changes.svelte';
	$: videoID = $page.params.videoID;
	$: video = $videos.find((x) => x.id === videoID);
</script>

{#if !video}
	No such Video found
{:else}
	<video src={video.video} controls autoPlay class="">
		<track kind="captions" />
	</video>
	<p>
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
	</p>
	<Changes />
{/if}
