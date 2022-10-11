<script lang="ts">
	import { page } from '$app/stores';
	import { setFixture } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import { onMount } from 'svelte';
	$: playerID = $page.params.playerID;
	$: player = $event.players[playerID];
	$: fixtureID = $page.params.fixtureID;
	$: fixture = $event.fixtures.find((x) => x.id === fixtureID);
	$: stats = fixture?.stats?.[playerID] ?? {
		matchesPlayed: 0,
		goals: 0,
		assists: 0,
		passes: 0,
		tackles: 0,
		dribbles: 0,
		shots: 0,
		yellowCard: 0,
		redCard: 0,
		goalConceived: 0,
		goalSaved: 0,
		handling: 0
	};

	onMount(() => {
		if (!fixture?.stats?.[playerID]) return;
		goals = '' + stats.goals;
		assists = '' + stats.assists;
		passes = '' + stats.passes;
		tackles = '' + stats.tackles;
		dribbles = '' + stats.dribbles;
		shots = '' + stats.shots;
		yellowCard = '' + stats.yellowCard;
		redCard = '' + stats.redCard;
		goalConceived = '' + stats.goalConceived;
		goalSaved = '' + stats.goalSaved;
		handling = '' + stats.handling;
	});

	let goals = '';
	let assists = '';
	let passes = '';
	let tackles = '';
	let dribbles = '';
	let shots = '';
	let yellowCard = '';
	let redCard = '';
	let goalConceived = '';
	let goalSaved = '';
	let handling = '';
	const isInt = /^(-||\+)\d+$/;

	$: ok =
		isInt.test(goals) &&
		isInt.test(assists) &&
		isInt.test(passes) &&
		isInt.test(tackles) &&
		isInt.test(dribbles) &&
		isInt.test(shots) &&
		isInt.test(yellowCard) &&
		isInt.test(redCard) &&
		(player.isGoalkeeper
			? isInt.test(goalConceived) && isInt.test(goalSaved) && isInt.test(handling)
			: true) &&
		!loading &&
		(parseInt(goals) !== stats.goals ||
			parseInt(assists) !== stats.assists ||
			parseInt(passes) !== stats.passes ||
			parseInt(tackles) !== stats.tackles ||
			parseInt(dribbles) !== stats.dribbles ||
			parseInt(shots) !== stats.shots ||
			parseInt(yellowCard) !== stats.yellowCard ||
			parseInt(redCard) !== stats.redCard ||
			(player.isGoalkeeper
				? parseInt(goalConceived) !== stats.goalConceived ||
				  parseInt(goalSaved) !== stats.goalSaved ||
				  parseInt(handling) !== stats.handling
				: false));

	let loading = false;
	let err: any;
	async function updateStats() {
		loading = true;
		try {
			await setFixture(fixtureID, playerID, {
				goals: parseInt(goals),
				assists: parseInt(assists),
				passes: parseInt(passes),
				tackles: parseInt(tackles),
				dribbles: parseInt(dribbles),
				shots: parseInt(shots),
				yellowCard: parseInt(yellowCard),
				redCard: parseInt(redCard),
				goalConceived: player.isGoalkeeper ? parseInt(goalConceived) : 0,
				goalSaved: player.isGoalkeeper ? parseInt(goalSaved) : 0,
				handling: player.isGoalkeeper ? parseInt(handling) : 0,
				teamID: player.teamID
			});
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<form on:submit|preventDefault={updateStats}>
	<div class="field max-w-[18rem]">
		<label for="goals" class="capitalize flex justify-between">
			<span>goals</span>
		</label>
		<input bind:value={goals} id="goals" />
		{#if !isInt.test(goals)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="assists" class="capitalize flex justify-between">
			<span>assists</span>
		</label>
		<input bind:value={assists} id="assists" />
		{#if !isInt.test(assists)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="passes" class="capitalize flex justify-between">
			<span>passes</span>
		</label>
		<input bind:value={passes} id="passes" />
		{#if !isInt.test(passes)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="tackles" class="capitalize flex justify-between">
			<span>tackles | intercept | block</span>
		</label>
		<input bind:value={tackles} id="tackles" />
		{#if !isInt.test(tackles)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="dribbles" class="capitalize flex justify-between">
			<span>dribbles</span>
		</label>
		<input bind:value={dribbles} id="dribbles" />
		{#if !isInt.test(dribbles)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="shots" class="capitalize flex justify-between">
			<span>shots</span>
		</label>
		<input bind:value={shots} id="shots" />
		{#if !isInt.test(shots)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="yellowCard" class="capitalize flex justify-between">
			<span>yellow Card</span>
		</label>
		<input bind:value={yellowCard} id="yellowCard" />
		{#if !isInt.test(yellowCard)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="redCard" class="capitalize flex justify-between">
			<span>red Card</span>
		</label>
		<input bind:value={redCard} id="redCard" />
		{#if !isInt.test(redCard)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	{#if player.isGoalkeeper}
		<div class="field max-w-[18rem]">
			<label for="goalConceived" class="capitalize flex justify-between">
				<span>goal conceded</span>
			</label>
			<input bind:value={goalConceived} id="goalConceived" />
			{#if !isInt.test(goalConceived)}
				<p class="err">Intiger required</p>
			{/if}
		</div>
		<div class="field max-w-[18rem]">
			<label for="goalSaved" class="capitalize flex justify-between">
				<span>goal Saved</span>
			</label>
			<input bind:value={goalSaved} id="goalSaved" />
			{#if !isInt.test(goalSaved)}
				<p class="err">Intiger required</p>
			{/if}
		</div>
		<div class="field max-w-[18rem]">
			<label for="handling" class="capitalize flex justify-between">
				<span>handling</span>
			</label>
			<input bind:value={handling} id="handling" />
			{#if !isInt.test(handling)}
				<p class="err">Intiger required</p>
			{/if}
		</div>
	{/if}
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit">
		{loading ? 'Loading...' : 'Match Played'}
	</button>
</form>
