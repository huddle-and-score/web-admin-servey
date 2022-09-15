<script lang="ts">
	import { page } from '$app/stores';
	import { setPlayer } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import { onMount } from 'svelte';
	$: playerID = $page.params.playerID;
	$: player = $event.players[playerID];

	$: teams = $event.sortedTeams;
	let displayImage: FileList | undefined;
	$: displayImageErr = (displayImage?.length ?? 0) > 1;
	let name = '';
	$: nameErr = !name;
	let teamID = '';
	$: teamIDErr = teams.find((x) => x.id === teamID) === undefined;
	let jerseyNum = '';
	$: jerseyNumErr = !/^\d+$/.test(jerseyNum);
	let position: 'Forward' | 'Midfield' | 'Defence' | 'Goalkeeper';
	$: positionErr = !position;
	let instagramUsername = '';
	$: instagramUsernameErr = instagramUsername === '';
	let place = '';
	$: placeErr = place === '';

	$: ok =
		!displayImageErr &&
		!nameErr &&
		!teamIDErr &&
		!jerseyNumErr &&
		!positionErr &&
		!placeErr &&
		!instagramUsernameErr &&
		!loading &&
		(displayImage?.length == 1 ||
			name !== player.name ||
			teamID !== player.teamID ||
			jerseyNum !== player.jerseyNum ||
			position !== player.position ||
			instagramUsername !== player.instagramUsername ||
			place !== player.place);

	onMount(function () {
		name = player.name;
		teamID = player.teamID;
		jerseyNum = player.jerseyNum;
		position = player.position;
		instagramUsername = player.instagramUsername;
		place = player.place;
	});

	let loading = false;
	let err: any;
	async function updateProfile() {
		loading = true;
		try {
			await setPlayer(playerID, {
				teamID,
				jerseyNum,
				name,
				displayImage: displayImage?.[0] ?? player.displayImage,
				position,
				instagramUsername,
				place
			});
			displayImage = undefined;
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<form on:submit|preventDefault={updateProfile}>
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
	<div class="field">
		<label for="place">Place</label>
		<input bind:value={place} id="place" />
		{#if placeErr}
			<p class="err">Enter player's Place</p>
		{/if}
	</div>
	<div class="err">
		{err ?? ''}
	</div>
	<button disabled={!ok} type="submit">
		{loading ? 'Loading...' : 'Submit'}
	</button>
</form>
