<script lang="ts">
	import { setTeam } from '$lib/firebase/db';
	import Slider from '$lib/Slider.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type ColorPickerClass from 'svelte-awesome-color-picker';
	let loading = false;
	let err: any;
	let color = '#000000';
	let logo: FileList;
	$: logoErr = !logo || logo.length !== 1;
	let name = '';
	$: nameErr = !name;
	let teamChemistry = 42;
	let acronym = '';
	$: acronymErr = !/^[A-Za-z]{3}$/.test(acronym);
	$: ok = !logoErr && !nameErr && !acronymErr && !loading;

	let ColorPicker: typeof ColorPickerClass;

	onMount(function () {
		import('svelte-awesome-color-picker').then((res) => (ColorPicker = res.default));
	});

	async function createTeam() {
		loading = true;
		try {
			const teamID = await setTeam($page.params.eventID, undefined, {
				logo: logo[0],
				color,
				name,
				teamChemistry,
				acronym: acronym.toLocaleUpperCase()
			});
			await goto('/event/' + $page.params.eventID + '/teams/' + teamID);
		} catch (e) {
			err = e;
			console.error(e);
			loading = false;
		}
	}
</script>

<div>
	<label for="color">Team Color</label>
	<svelte:component this={ColorPicker} bind:hex={color} />
</div>
<form on:submit|preventDefault={createTeam}>
	<div class="field">
		<label for="logo">Team Logo</label>
		<input bind:files={logo} id="logo" type="file" />
		{#if logoErr}
			<p class="err">Select a Logo</p>
		{/if}
	</div>

	<div class="field">
		<label for="name">Team Name</label>
		<input bind:value={name} id="name" />
		{#if nameErr}
			<p class="err">Enter a Name</p>
		{/if}
	</div>
	<div class="field">
		<label for="acronym">Team Acronym</label>
		<input bind:value={acronym} id="acronym" />
		{#if acronymErr}
			<p class="err">Enter a Acronym of 3 letters</p>
		{/if}
	</div>
	<div class="field">
		<label for="team-chemistry" class="flex justify-between">
			<span>Team Chemistry</span>
			<span>{teamChemistry}%</span>
		</label>
		<Slider bind:value={teamChemistry} id="team-chemistry" />
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
