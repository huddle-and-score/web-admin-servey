<script lang="ts">
	import { page } from '$app/stores';
	import { event } from '$lib/state';
	import { setTeam } from '$lib/db';
	import Slider from '$lib/Slider.svelte';
	import { onMount } from 'svelte';
	import type ColorPickerClass from 'svelte-awesome-color-picker';
	$: teamID = $page.params.teamID;
	$: team = $event.teams[teamID];

	let loading = false;
	let err: any;
	let color = '#000000';
	let logo: FileList | undefined;
	$: logoErr = (logo?.length ?? 0) > 1;
	let name = '';
	$: nameErr = !name;
	let teamChemistry = 42;
	let acronym = '';
	$: acronymErr = !/^[A-Za-z]{3}$/.test(acronym);
	$: ok =
		!logoErr &&
		!nameErr &&
		!acronymErr &&
		!loading &&
		(logo?.length == 1 ||
			name !== team.name ||
			color !== team.color ||
			acronym !== team.acronym ||
			teamChemistry !== team.teamChemistry);

	let ColorPicker: typeof ColorPickerClass;

	onMount(function () {
		import('svelte-awesome-color-picker').then((res) => (ColorPicker = res.default));
		color = team.color;
		name = team.name;
		teamChemistry = team.teamChemistry;
		acronym = team.acronym;
	});

	async function updateTeam() {
		loading = true;
		try {
			await setTeam(teamID, {
				logo: logo?.[0] ?? team.logo,
				color,
				name,
				teamChemistry,
				acronym: acronym.toLocaleUpperCase()
			});
			logo = undefined;
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

{#if ColorPicker}
	<div class="field">
		<label for="color">Team Color</label>
		<svelte:component this={ColorPicker} id="color" bind:hex={color} />
	</div>
{/if}
<form on:submit|preventDefault={updateTeam}>
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
