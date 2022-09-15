<script lang="ts">
	import { event } from '$lib/state';
	import { setLiveStream } from '$lib/firebase/db';
	import { onMount } from 'svelte';

	$: liveStreamUrl = $event.liveStream ?? '';

	let url = '';
	$: urlErr = url !== '' && isValidHttpUrl(url);

	onMount(function () {
		if (liveStreamUrl) url = liveStreamUrl;
	});

	$: ok = (url !== liveStreamUrl && !urlErr) || loading;
	let err: any;
	let loading = false;

	function isValidHttpUrl(str: string) {
		try {
			new URL(str);
			return false;
		} catch {
			return true;
		}
	}

	async function submit() {
		loading = true;
		try {
			await setLiveStream(url || null);
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<h1 class="text-2xl underline">Live Stream</h1>
<div class="mt-3">
	{#if liveStreamUrl}
		<a href={liveStreamUrl} target="_blank">🔗 {liveStreamUrl}</a>
	{:else}
		no live url ❌
	{/if}
</div>

<form on:submit|preventDefault={submit}>
	<div class="field">
		<label for="stream">Stream Url</label>
		<input bind:value={url} id="stream" />
		{#if urlErr}
			<p class="err">Incorrect Url was found</p>
		{/if}
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit">
		{loading ? 'Loading...' : 'Submit'}
	</button>
</form>
