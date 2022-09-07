<script lang="ts">
	import { page } from '$app/stores';
	import { setFixture } from '$lib/db';
	import { event } from '$lib/state';
	import { onMount } from 'svelte';
	$: fixtureID = $page.params.fixtureID;
	$: fixture = $event.fixtures.find((x) => x.id === fixtureID)!;
	let time = '';
	$: timeErr = !time;
	let loading = false;
	$: ok = !loading && !timeErr && fixture.time !== time;
	let err: any;
	onMount(function () {
		time = fixture.time;
	});
	function setTime() {
		loading = true;
		try {
			setFixture(fixtureID, time);
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<form on:submit|preventDefault={setTime}>
	<div class="field">
		<label for="time">Match Time</label>
		<input type="datetime-local" bind:value={time} />
		{#if timeErr}
			<p class="err">Select a Match Timing</p>
		{/if}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
