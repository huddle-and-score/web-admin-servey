<script lang="ts">
	import { event } from '$lib/state';
	import { page } from '$app/stores';
</script>

<h1 class="text-2xl underline">Fixtures</h1>

<a
	class="w-full cursor-pointer block mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
	href="fixtures/__"
>
	➕ Create Fixture
</a>

{#each $event.fixtures as fixture}
	<a href="/event/{$page.params.eventID}/fixtures/{fixture.id}" class="flex py-0.5 border-y mt-5 ">
		<div
			style="width: 9.81px; background-color: {fixture.team1
				.color}; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);"
		/>
		<div class="w-full text-xl items-center flex justify-around pb-4 pt-5 font-medium">
			<span>{fixture.team1.acronym}</span>
			<img src={fixture.team1.logo} alt={fixture.team1.name} class="w-9 h-10" />
			<span class="whitespace-nowrap">
				{fixture.scores?.team1 ?? 0} - {fixture.scores?.team2 ?? 0}
			</span>
			<img src={fixture.team2.logo} alt={fixture.team1.name} class="w-9 h-10" />
			<span>{fixture.team2.acronym}</span>
		</div>
		<div
			style="width: 9.81px; background-color: {fixture.team2
				.color}; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);"
		/>
	</a>
{/each}
