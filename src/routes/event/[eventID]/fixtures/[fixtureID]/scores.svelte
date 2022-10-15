<script lang="ts">
	import { page } from '$app/stores';
	import { setFixture } from '$lib/firebase/db';
	import { event } from '$lib/state';
	$: fixtureID = $page.params.fixtureID;
	$: fixture = $event.fixtures.find((x) => x.id === fixtureID)!;
	$: team1score = fixture.scores?.team1 ?? 0;
	$: team2score = fixture.scores?.team2 ?? 0;
	let loading = false;
	let err: any;
	async function setScore(team: 1 | 2, inc: 1 | -1) {
		loading = true;
		try {
			await setFixture($page.params.eventID, fixtureID, team, inc);
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<h1 class="text-3xl mt-2 underline">{fixture.team1.name}</h1>
<div class="flex text-xl items-center justify-between mt-5">
	<button disabled={loading || !team1score} on:click={() => setScore(1, -1)}>
		{loading ? '-1...' : ' -1 '}
	</button>
	<div class="text-center">
		<div>Current Score</div>
		<div>
			<span class="text-base">{team1score - 1}</span>
			<span class="text-3xl">← {team1score} →</span>
			<span class="text-base">{1 + team1score}</span>
		</div>
	</div>
	<button disabled={loading} on:click={() => setScore(1, 1)}>
		{loading ? '+1...' : ' +1 '}
	</button>
</div>

<h1 class="text-3xl mt-2 underline">{fixture.team2.name}</h1>
<div class="flex text-xl items-center justify-between mt-5">
	<button disabled={!team2score || loading} on:click={() => setScore(2, -1)}>
		{loading ? '-1...' : ' -1 '}
	</button>
	<div class="text-center">
		<div>Current Score</div>
		<div>
			<span class="text-base">{team2score - 1}</span>
			<span class="text-3xl">← {team2score} →</span>
			<span class="text-base">{1 + team2score}</span>
		</div>
	</div>
	<button disabled={loading} on:click={() => setScore(2, 1)}>
		{loading ? '+1...' : ' +1 '}
	</button>
</div>

{#if err}
	<p class="err">{err}</p>
{/if}

<style>
	button {
		@apply p-4 bg-black text-white rounded-lg disabled:opacity-50;
	}
</style>
