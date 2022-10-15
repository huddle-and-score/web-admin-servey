<script lang="ts">
	import { goto } from '$app/navigation';
	import { setFixture } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import { page } from '$app/stores';
	$: teams = $event.sortedTeams;

	let team1ID = '1';
	$: team1IDErr = teams.find((x) => x.id === team1ID) === undefined;
	let team2ID = '2';
	$: team2IDErr = teams.find((x) => x.id === team2ID) === undefined || team1ID === team2ID;
	let time = '';
	$: timeErr = !time;

	$: ok = !team1IDErr && !team2IDErr && !timeErr && !loading;

	$: {
		console.log(typeof time, time);
	}

	let loading = false;
	let err: any;
	async function createFixture() {
		loading = true;
		try {
			await setFixture($page.params.eventID, undefined, {
				team1ID,
				team2ID,
				time
			});
			await goto('/fixtures');
		} catch (e) {
			err = e;
			console.error(e);
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={createFixture}>
	<div class="field">
		<label for="team1ID">Team1</label>
		<select bind:value={team1ID} id="team1ID">
			{#each teams as team}
				<option hidden={team2ID === team.id} value={team.id}>{team.name}</option>
			{/each}
		</select>
		{#if team1IDErr}
			<p class="err">Select a Team</p>
		{/if}
	</div>
	<div class="field">
		<label for="team2ID">Team2</label>
		<select bind:value={team2ID} id="team1ID">
			{#each teams as team}
				<option hidden={team1ID === team.id} value={team.id}>{team.name}</option>
			{/each}
		</select>
		{#if team2IDErr}
			<p class="err">Select a Team</p>
		{/if}
	</div>
	<div class="field">
		<label for="time">Match On</label>
		<input type="datetime-local" bind:value={time} id="time" />
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
