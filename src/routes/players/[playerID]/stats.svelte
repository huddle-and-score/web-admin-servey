<script lang="ts">
	import { page } from '$app/stores';
	import { setPlayer } from '$lib/db';
	import { event } from '$lib/state';
	$: playerID = $page.params.playerID;
	$: player = $event.players[playerID];

	let matchesPlayed: '1' | '0' | '-1' | '' = '';
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
		/^(1|0|-1)$/.test(matchesPlayed) &&
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
		!loading;

	let loading = false;
	let err: any;
	async function updateStats() {
		loading = true;
		try {
			await setPlayer(playerID, {
				matchesPlayed: parseInt(matchesPlayed) as 0 | 1 | -1,
				goals: parseInt(goals),
				assists: parseInt(assists),
				passes: parseInt(passes),
				tackles: parseInt(tackles),
				dribbles: parseInt(dribbles),
				shots: parseInt(shots),
				yellowCard: parseInt(yellowCard),
				redCard: parseInt(redCard),
				/// position === "Goalkeeper"
				...(player.isGoalkeeper
					? {
							goalConceived: parseInt(goalConceived),
							goalSaved: parseInt(goalSaved),
							handling: parseInt(handling)
					  }
					: {
							goalConceived: 0,
							goalSaved: 0,
							handling: 0
					  })
			});
			matchesPlayed = '';
			goals = '';
			assists = '';
			passes = '';
			tackles = '';
			dribbles = '';
			shots = '';
			yellowCard = '';
			redCard = '';
			goalConceived = '';
			goalSaved = '';
			handling = '';
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<form on:submit|preventDefault={updateStats}>
	<div class="flex justify-between">
		<div class="field">
			<label for="type">Change Type</label>
			<select id="type" bind:value={matchesPlayed}>
				<option value="0">Set Values</option>
				<option value="1">Add Values</option>
				<option hidden value="-1">Add Values</option>
			</select>
			{#if !matchesPlayed}
				<p class="err">Select a Type</p>
			{/if}
		</div>
		{#if matchesPlayed === '1' || matchesPlayed === '-1'}
			<div class="field">
				<label for="matches-played">Matches Played</label>
				<select id="matches-played" bind:value={matchesPlayed}>
					<option value="1">Match Played (+1)</option>
					<option value="-1">Match Played (-1)</option>
				</select>
			</div>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="goals" class="capitalize flex justify-between">
			<span>goals</span>
			<span class="pr-2">
				{player.goals} → {matchesPlayed === '0' ? goals : parseInt(goals) + player.goals}
			</span>
		</label>
		<input bind:value={goals} id="goals" />
		{#if !isInt.test(goals)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="assists" class="capitalize flex justify-between">
			<span>assists</span>
			<span class="pr-2">
				{player.assists} → {matchesPlayed === '0' ? assists : parseInt(assists) + player.assists}
			</span>
		</label>
		<input bind:value={assists} id="assists" />
		{#if !isInt.test(assists)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="passes" class="capitalize flex justify-between">
			<span>passes</span>
			<span class="pr-2">
				{player.passes} → {matchesPlayed === '0' ? passes : parseInt(passes) + player.passes}
			</span>
		</label>
		<input bind:value={passes} id="passes" />
		{#if !isInt.test(passes)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="tackles" class="capitalize flex justify-between">
			<span>tackles</span>
			<span class="pr-2">
				{player.tackles} → {matchesPlayed === '0' ? tackles : parseInt(tackles) + player.tackles}
			</span>
		</label>
		<input bind:value={tackles} id="tackles" />
		{#if !isInt.test(tackles)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="dribbles" class="capitalize flex justify-between">
			<span>dribbles</span>
			<span class="pr-2">
				{player.dribbles} → {matchesPlayed === '0'
					? dribbles
					: parseInt(dribbles) + player.dribbles}
			</span>
		</label>
		<input bind:value={dribbles} id="dribbles" />
		{#if !isInt.test(dribbles)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="shots" class="capitalize flex justify-between">
			<span>shots</span>
			<span class="pr-2">
				{player.shots} → {matchesPlayed === '0' ? shots : parseInt(shots) + player.shots}
			</span>
		</label>
		<input bind:value={shots} id="shots" />
		{#if !isInt.test(shots)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="yellowCard" class="capitalize flex justify-between">
			<span>yellowCard</span>
			<span class="pr-2">
				{player.yellowCard} → {matchesPlayed === '0'
					? yellowCard
					: parseInt(yellowCard) + player.yellowCard}
			</span>
		</label>
		<input bind:value={yellowCard} id="yellowCard" />
		{#if !isInt.test(yellowCard)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	<div class="field max-w-[18rem]">
		<label for="redCard" class="capitalize flex justify-between">
			<span>redCard</span>
			<span class="pr-2">
				{player.redCard} → {matchesPlayed === '0' ? redCard : parseInt(redCard) + player.redCard}
			</span>
		</label>
		<input bind:value={redCard} id="redCard" />
		{#if !isInt.test(redCard)}
			<p class="err">Intiger required</p>
		{/if}
	</div>
	{#if player.isGoalkeeper}
		<div class="field max-w-[18rem]">
			<label for="goalConceived" class="capitalize flex justify-between">
				<span>goalConceived</span>
				<span class="pr-2">
					{player.goalConceived} → {matchesPlayed === '0'
						? goalConceived
						: parseInt(goalConceived) + player.goalConceived}
				</span>
			</label>
			<input bind:value={goalConceived} id="goalConceived" />
			{#if !isInt.test(goalConceived)}
				<p class="err">Intiger required</p>
			{/if}
		</div>
		<div class="field max-w-[18rem]">
			<label for="goalSaved" class="capitalize flex justify-between">
				<span>goalSaved</span>
				<span class="pr-2">
					{player.goalSaved} → {matchesPlayed === '0'
						? goalSaved
						: parseInt(goalSaved) + player.goalSaved}
				</span>
			</label>
			<input bind:value={goalSaved} id="goalSaved" />
			{#if !isInt.test(goalSaved)}
				<p class="err">Intiger required</p>
			{/if}
		</div>
		<div class="field max-w-[18rem]">
			<label for="handling" class="capitalize flex justify-between">
				<span>handling</span>
				<span class="pr-2">
					{player.handling} → {matchesPlayed === '0'
						? handling
						: parseInt(handling) + player.handling}
				</span>
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
		{loading ? 'Loading...' : 'Submit'}
	</button>
</form>
