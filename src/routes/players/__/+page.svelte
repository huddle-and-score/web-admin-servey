<script lang="ts">
	import { goto } from '$app/navigation';
	import { setPlayer } from '$lib/db';
	import { event } from '$lib/state';
	$: teams = $event.sortedTeams;
	let displayImage: FileList;
	$: displayImageErr = !displayImage || displayImage.length !== 1;
	let name = '';
	$: nameErr = !name;
	let teamID = '';
	$: teamIDErr = teams.find((x) => x.id === teamID) === undefined;
	let jerseyNum = '';
	$: jerseyNumErr = !/^\d+$/.test(jerseyNum);
	let position: string = '';
	$: positionErr = position === '';
	let instagramUsername = '';
	$: instagramUsernameErr = instagramUsername === '';

	$: ok =
		!displayImageErr &&
		!nameErr &&
		!teamIDErr &&
		!jerseyNumErr &&
		!positionErr &&
		!instagramUsernameErr &&
		!loading;

	let loading = false;
	let err: any;
	async function createPlayer() {
		loading = true;
		try {
			const playerID = await setPlayer(undefined, {
				teamID,
				jerseyNum,
				name,
				displayImage: displayImage[0],
				position,
				instagramUsername
			});
			await goto('/players/' + playerID);
		} catch (e) {
			err = e;
			console.error(e);
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={createPlayer}>
	<div class="field">
		<label for="teamID">From Team</label>
		<select bind:value={teamID} id="teamID">
			{#each teams as team}
				<option value={team.id}>{team.name}</option>
			{/each}
		</select>
		{#if teamIDErr}
			<p class="err">Select a Team</p>
		{/if}
	</div>
	<div class="field">
		<label for="position">Position</label>
		<select bind:value={position} id="position">
			<option value="Forward">Forward</option>
			<option value="Midfield">Midfield</option>
			<option value="Defence">Defence</option>
			<option value="Goalkeeper">*Goalkeeper</option>
		</select>
		{#if positionErr}
			<p class="err">Select Player position</p>
		{/if}
	</div>
	<div class="field">
		<label for="display-image">Display Image</label>
		<input bind:files={displayImage} type="file" id="display-image" />
		{#if displayImageErr}
			<p class="err">Select a Display Image</p>
		{/if}
	</div>
	<div class="field">
		<label for="name">Name</label>
		<input bind:value={name} id="name" />
		{#if nameErr}
			<p class="err">Enter a Name</p>
		{/if}
	</div>
	<div class="field">
		<label for="jersey-num">Jersey Num</label>
		<input bind:value={jerseyNum} id="jersey-num" />
		{#if jerseyNumErr}
			<p class="err">Enter a Valid Jersey Num</p>
		{/if}
	</div>
	<div class="field">
		<label for="instagram-username">Instagram Username</label>
		<input bind:value={instagramUsername} id="instagram-username" />
		{#if instagramUsernameErr}
			<p class="err">Enter player's username</p>
		{/if}
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit"> {loading ? 'Loading...' : 'Submit'} </button>
</form>
