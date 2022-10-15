<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { setPlayer } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import Profile from './profile.svelte';
	$: playerID = $page.params.playerID;
	$: player = $event.players[playerID];
	let loading = false;
	let err: any;
	async function deletePlayer() {
		if (!confirm('Are you sure, this will delete the object. Once deleted cant be recovered'))
			return;
		try {
			await setPlayer($page.params.eventID, playerID, null);
			goto('/players');
		} catch (e) {
			err = e;
			console.log(e);
		}
	}
</script>

{#if !player}
	No such player found
{:else}
	<div class="flex justify-between text-sm md:text-base">
		<div class="flex">
			<img
				alt={player.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={player.displayImage}
			/>
			<div>
				<h1 class="text-2xl md:text-3xl">{player.name}</h1>
				<span>
					Team:
					<a
						href="/event/{$page.params.eventID}/teams/{player.teamID}"
						class="text-pink-500 underline font-bold"
					>
						{player.team.name}
					</a>
				</span>
				<div class="text-red-700">Match Played: {player.matchesPlayed}</div>
				<div>PlayerID: “{playerID}”</div>
			</div>
		</div>
	</div>
	<Profile />
	<!-- <button
		disabled={loading}
		on:click={deletePlayer}
		class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
	>
		{loading ? 'Loading...' : 'Delete'}
	</button>
	<p class="err">{err ?? ''}</p> -->
{/if}
