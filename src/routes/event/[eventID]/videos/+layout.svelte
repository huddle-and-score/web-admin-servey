<script lang="ts">
	import { videosRef } from '$lib/firebase/db';
	import { onMount } from 'svelte';
	import { onSnapshot } from 'firebase/firestore';
	import { videos } from '$lib/state';
	import { page } from '$app/stores';

	onMount(function () {
		return onSnapshot(videosRef($page.params.eventID), {
			next(snapshot) {
				videos.set(snapshot.docs.map((x) => x.data()));
			}
		});
	});
</script>

{#if $videos}
	<slot />
{:else}
	Loading...
{/if}
