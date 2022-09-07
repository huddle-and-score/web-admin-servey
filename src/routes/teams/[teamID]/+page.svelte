<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { setTeam } from '$lib/db';
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
	<div class="flex justify-between">
		<div class="flex">
			<img
				alt={team.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={team.logo}
			/>
			<h1 class="text-3xl underline">{team.name}</h1>
		</div>
		<div class="text-right">
			<div class="text-red-700 underline">Match Played: {team.matchesPlayed}</div>
			<div>TeamID: “{teamID}”</div>
		</div>
	</div>
	<Profile />
	<a
		class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
		href="/players/__"
	>
		➕ Create Player
	</a>
	{#each team.players as player}
		<a
			href="/players/{player.id}"
			class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
		>
			<div class="w-2 h-20 -mt-3" style="background-color: {team.color}" />
			<img
				alt={player.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={player.displayImage}
			/>
			<div class="flex justify-between w-full">
				<div>
					<span class="block">
						{player.name}
					</span>
					<span class="block">
						{player.instagramUsername}
					</span>
				</div>
				<span>
					{player.points}
				</span>
			</div>
		</a>
	{/each}
{/if}
<button
	disabled={loading}
	on:click={deleteTeam}
	class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
>
	{loading ? 'Loading...' : 'Delete'}
</button>
<p class="err">{err ?? ''}</p>
