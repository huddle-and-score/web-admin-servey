<script lang="ts">
	import { page } from '$app/stores';
	import { news as newsStore, event } from '$lib/state';
	import { setNews } from '$lib/db';
	import { getBeforeContent, getSuggestionsInContent } from '$lib/utility';
	import { onMount } from 'svelte';

	$: newsID = $page.params.newsID;
	$: news = $newsStore.find((x) => x.id === newsID)!;
	$: newsCaption = news.content
		.map((x) => {
			if (x.type === 'text') return x.text;
			if (x.type === 'team') return '@' + $event.teams[x.teamID].acronym;
			return '@' + $event.players[x.playerID].team.acronym + $event.players[x.playerID].jerseyNum;
		})
		.join('');

	let caption = '';
	$: connection = getBeforeContent(caption, $event);
	$: suggestions = getSuggestionsInContent(caption, $event);
	let image: FileList | undefined;
	let loading = false;
	let err: any;
	$: ok = !loading && caption && (caption !== newsCaption || image?.length === 1);
	onMount(function () {
		caption = newsCaption;
	});
	async function updateNews() {
		loading = true;
		try {
			await setNews(newsID, {
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

<div class="field">
	<label for="caption">Caption</label>
	<textarea bind:value={caption} class="min-w-full min-h-[150px]" id="caption" />
	<label for="caption">Suggestions</label>
	<div
		class="hide-scroll-bar mt-0.5 border items-start overflow-x-auto overflow-y-hidden rounded flex space-x-2 px-1"
	>
		<div class="h-10" />
		{#each suggestions.suggestion as suggestion}
			<button
				on:click={() => (caption = suggestion.setStr)}
				class="px-2 whitespace-nowrap h-10 my-1 bg-gray-300 rounded-lg"
			>
				{suggestion.val.name}
			</button>
		{/each}
	</div>
	{#if !caption}
		<p class="err">Enter a Caption</p>
	{/if}
</div>
<form on:submit|preventDefault={updateNews}>
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
{#each connection as val}
	{#if val.type === 'player'}
		<a
			href="/players/{val.player.id}"
			class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
		>
			<div class="w-2 h-20 -mt-3" style="background-color: {val.player.team.color}" />
			<img
				alt={val.player.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={val.player.displayImage}
			/>
			<div class="flex justify-between w-full">
				<div>
					<span class="block">
						{val.player.name}
					</span>
					<span class="block">
						{val.player.team.acronym}
					</span>
				</div>
				<span>
					{val.player.points}
				</span>
			</div>
		</a>
	{:else if val.type === 'team'}
		<a
			href="/teams/{val.team.id}"
			class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
		>
			<div class="w-2 h-20 -mt-3" style="background-color: {val.team.color}" />
			<img
				alt={val.team.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={val.team.logo}
			/>
			<div class="flex justify-between w-full">
				<div>
					<span class="block">
						{val.team.name}
					</span>
					<span class="block">
						{val.team.acronym}
					</span>
				</div>
				<span>
					{val.team.points}
				</span>
			</div>
		</a>
	{/if}
{/each}
