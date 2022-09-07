<script lang="ts">
	import { page } from '$app/stores';
	import { event } from '$lib/state';
	import Scores from './scores.svelte';
	import SetTime from './setTime.svelte';
	$: fixtureID = $page.params.fixtureID;
	$: fixture = $event.fixtures.find((x) => x.id === fixtureID)!;
</script>

{#if !fixture}
	No such fixture found
{:else}
	<div class="w-full h-20 flex justify-between mt-3 border border-gray-700 rounded-xl px-3 text-xl">
		<a
			href="/teams/{fixture.team1ID}"
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
			href="/teams/{fixture.team2ID}"
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
	</div>
	<Scores />
	<SetTime />
{/if}
