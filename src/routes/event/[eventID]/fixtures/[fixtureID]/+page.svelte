<script lang="ts">
	import { goto } from '$app/navigation';

	import { page } from '$app/stores';
	import { setFixture } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import Scores from './scores.svelte';
	import SetTime from './setTime.svelte';
	$: fixtureID = $page.params.fixtureID;
	$: fixture = $event.fixtures.find((x) => x.id === fixtureID)!;
	let loading = false;
	let err: any;
	async function deleteFixture() {
		if (!confirm('Are you sure, this will delete the object. Once deleted cant be recovered'))
			return;
		try {
			await setFixture($page.params.eventID, fixtureID, null);
			goto('/event/' + $page.params.eventID +'/fixtures');
		} catch (e) {
			err = e;
			console.log(e);
		}
	}
</script>

{#if !fixture}
	No such fixture found
{:else}
	<div class="flex py-0.5 border-y bg-base2 mt-5 ">
		<div
			style="width: 9.81px; background-color: {fixture.team1
				.color}; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);"
		/>
		<div class="w-full text-xl items-center flex justify-around pb-4 pt-5 font-medium">
			<span>{fixture.team1.acronym}</span>
			<a href="/event/{$page.params.eventID}/teams/{fixture.team1ID}"
				><img src={fixture.team1.logo} alt={fixture.team1.name} class="w-9 h-10" /></a
			>
			<span class="whitespace-nowrap">
				{fixture.scores?.team1 ?? 0} - {fixture.scores?.team2 ?? 0}
			</span>
			<a href="/event/{$page.params.eventID}/teams/{fixture.team2ID}"
				><img src={fixture.team2.logo} alt={fixture.team1.name} class="w-9 h-10" /></a
			>
			<span>{fixture.team2.acronym}</span>
		</div>
		<div
			style="width: 9.81px; background-color: {fixture.team2
				.color}; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);"
		/>
	</div>
	<!-- <div class="w-full h-20 flex justify-between mt-3 border border-gray-700 rounded-xl px-3 text-xl">
		<a
			href="/event/{$page.params.eventID}/teams/{fixture.team1ID}"
			class="flex border-l-8 py-3"
			style="border-color: {fixture.team1.color}"
		>
			<img
				alt={fixture.team1.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={fixture.team1.logo}
			/>
			<div>
				{fixture.team1.acronym}
			</div>
		</a>
		<div class="text-center py-3">
			{#if fixture.scores}
				<div>
					{fixture.scores.team1 ?? '--'}
					-
					{fixture.scores.team2 ?? '--'}
				</div>
			{:else}
				<div>No score</div>
			{/if}
			<div class="text-base mt-2">{fixture.displayTime}</div>
		</div>
		<a
			href="/event/{$page.params.eventID}/teams/{fixture.team2ID}"
			class="flex border-r-8 py-3"
			style="border-color: {fixture.team2.color}"
		>
			<div>
				{fixture.team2.acronym}
			</div>
			<img
				alt={fixture.team2.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={fixture.team2.logo}
			/>
		</a>
	</div> -->
	<Scores />
	<SetTime />
	<p class="err">{err ?? ''}</p>
	<h1 class="mt-5 text-3xl underline">Team1: {fixture.team1.name}</h1>
	{#each $event.teams[fixture.team1ID].players as player}
		<a
			href="/event/{$page.params.eventID}/fixtures/{fixtureID}/{player.id}"
			class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
		>
			<div class="w-2 h-20 -mt-3" style="background-color: {fixture.team1.color}" />
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
					{#if fixture.stats?.[player.id]}
						<span class="block"> Played ✅ </span>
					{:else}
						<span class="block"> Not Played ❌ </span>
					{/if}
				</div>
			</div>
		</a>
	{/each}
	<h1 class="mt-5 text-3xl underline">Team2: {fixture.team2.name}</h1>
	{#each $event.teams[fixture.team2ID].players as player}
		<a
			href="/event/{$page.params.eventID}/fixtures/{fixtureID}/{player.id}"
			class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
		>
			<div class="w-2 h-20 -mt-3" style="background-color: {fixture.team1.color}" />
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
					{#if fixture.stats?.[player.id]}
						<span class="block"> Played ✅ </span>
					{:else}
						<span class="block"> Not Played ❌ </span>
					{/if}
				</div>
			</div>
		</a>
	{/each}
	<button
		disabled={loading}
		on:click={deleteFixture}
		class="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg w-full my-5 text-2xl"
	>
		{loading ? 'Loading...' : 'Delete'}
	</button>
{/if}
