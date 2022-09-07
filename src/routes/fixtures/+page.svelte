<script lang="ts">
	import { event } from '$lib/state';
</script>

<h1 class="text-2xl underline">Fixtures</h1>

<a
	class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
	href="fixtures/__"
>
	➕ Create Fixture
</a>

{#each $event.fixtures as fixture}
	<a
		href="/fixtures/{fixture.id}"
		class="w-full h-20 flex justify-between cursor-pointer mt-3 border border-gray-700 rounded-xl px-3 text-xl"
	>
		<div class="flex border-l-8 py-3" style="border-color: {fixture.team1.color}">
			<img
				alt={fixture.team1.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={fixture.team1.logo}
			/>
			<div>
				{fixture.team1.acronym}
			</div>
		</div>
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
		<div class="flex border-r-8 py-3" style="border-color: {fixture.team2.color}">
			<div>
				{fixture.team2.acronym}
			</div>
			<img
				alt={fixture.team2.name}
				class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
				src={fixture.team2.logo}
			/>
		</div>
	</a>
{/each}
