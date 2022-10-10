<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { setTeam } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import Profile from './profile.svelte';
	$: teamID = $page.params.teamID;
	$: team = $event.teams[teamID];
	let loading = false;
	let err: any;
	async function deleteTeam() {
		if (!confirm('Are you sure, this will delete the object. Once deleted cant be recovered'))
			return;
		try {
			await setTeam(teamID, null);
			goto('/teams');
		} catch (e) {
			err = e;
			console.log(e);
		}
	}
</script>

{#if !team}
	No such team found
{:else}
	<div class="flex justify-between text-sm md:text-base">
		<div class="flex">
			<img
				alt={team.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={team.logo}
			/>
			<div>
				<h1 class="text-2xl md:text-3xl">{team.name}</h1>
				<div class="text-red-700">Match Played: {team.matchesPlayed}</div>
				<div>TeamID: “{teamID}”</div>
			</div>
		</div>
	</div>
	<Profile />
{/if}
<!-- <button
	disabled={loading}
	on:click={deleteTeam}
	class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
>
	{loading ? 'Loading...' : 'Delete'}
</button>
<p class="err">{err ?? ''}</p> -->
