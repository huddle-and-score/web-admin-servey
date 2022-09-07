<script lang="ts">
	import { page } from '$app/stores';
	import { event } from '$lib/state';
	import Profile from './profile.svelte';
	import Stats from './stats.svelte';
	$: playerID = $page.params.playerID;
	$: player = $event.players[playerID];
</script>

{#if !player}
	No such player found
{:else}
	<div class="flex justify-between">
		<div class="flex">
			<img
				alt={player.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={player.displayImage}
			/>
			<div>
				<h1 class="text-3xl">{player.name}</h1>
				<span>
					Team:
					<a href="/teams/{player.teamID}" class="text-pink-500 underline font-bold">
						{player.team.name}
					</a>
				</span>
			</div>
		</div>
		<div class="text-right">
			<div class="text-red-700 underline">Match Played: {player.matchesPlayed}</div>
			<div>PlayerID: “{playerID}”</div>
		</div>
	</div>
	<Profile />
	<Stats />
{/if}
