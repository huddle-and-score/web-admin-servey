<script lang="ts">
	import { newsRef } from '$lib/firebase/db';
	import { onMount } from 'svelte';
	import { onSnapshot } from 'firebase/firestore';
	import { news } from '$lib/state';

	onMount(function () {
		return onSnapshot(newsRef, {
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
