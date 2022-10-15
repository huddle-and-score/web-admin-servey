<script lang="ts">
	import { newsRef } from '$lib/firebase/db';
	import { onMount } from 'svelte';
	import { onSnapshot } from 'firebase/firestore';
	import { news } from '$lib/state';
	import { page } from '$app/stores';

	onMount(function () {
		return onSnapshot(newsRef($page.params.eventID), {
			next(snapshot) {
				news.set(snapshot.docs.map((x) => x.data()));
			}
		});
	});
</script>

{#if $news}
	<slot />
{:else}
	Loading...
{/if}
