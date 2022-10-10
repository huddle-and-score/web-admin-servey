<script lang="ts">
	import { page } from '$app/stores';
	import { setFixture } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import Stats from './stats.svelte';
	$: playerID = $page.params.playerID;
	$: player = $event.players[playerID];
	$: fixtureID = $page.params.fixtureID;
	$: fixture = $event.fixtures.find((x) => x.id === fixtureID);
	$: stats = fixture?.stats?.[playerID];
	let loading = false;
	let err: any;
	async function removePlayerStats() {
		if (!confirm('Are you sure, this will delete the object. Once deleted cant be recovered'))
			return;
		try {
			await setFixture(fixtureID, playerID, null);
		} catch (e) {
			err = e;
			console.log(e);
		}
	}
</script>

{#if !player}
	No such Player found
{:else if !fixture}
	No such Fixture found
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
					<a href="/teams/{player.teamID}" class="text-pink-500 underline font-bold">
						{player.team.name}
					</a>
				</span>
				<div class="text-red-700">Match Played: {player.matchesPlayed}</div>
				<div>PlayerID: “{playerID}”</div>
			</div>
		</div>
	</div>
	<Stats />
	{#if stats}
		<button
			disabled={loading}
			on:click={removePlayerStats}
			class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
		>
			{loading ? 'Loading...' : 'Not Played'}
		</button>
		<p class="err">{err ?? ''}</p>
	{/if}
{/if}
