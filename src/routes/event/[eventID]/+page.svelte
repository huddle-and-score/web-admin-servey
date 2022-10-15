<script lang="ts">
	import { page } from '$app/stores';
	import { config } from '$lib/state';
</script>

<h1 class="text-3xl font-bold underline">
	{$config.events[$page.params.eventID]?.title ?? 'not found'}
</h1>

<ul>
	<li><a href="/event/{$page.params.eventID}/live">🔴 Live</a></li>
	<li><a href="/event/{$page.params.eventID}/teams">👥 Teams</a></li>
	<li><a href="/event/{$page.params.eventID}/players">👤 Player</a></li>
	<li><a href="/event/{$page.params.eventID}/fixtures">⚽ Fixture</a></li>
	<li><a href="/event/{$page.params.eventID}/news">📰 News</a></li>
	<li><a href="/event/{$page.params.eventID}/videos">📹 Videos</a></li>
</ul>

<style>
	ul {
		@apply mt-5 space-y-2;
	}

	a {
		@apply bg-gray-200 rounded-xl cursor-pointer p-3 block w-full h-full;
	}
</style>
