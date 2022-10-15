<script lang="ts">
	import { onMount } from 'svelte';
	import { EventColl } from '$lib/firebase/db';
	import { event } from '$lib/state';
	import { doc, onSnapshot } from 'firebase/firestore';
	import { page } from '$app/stores';

	onMount(function () {
		const eventSub = onSnapshot(doc(EventColl, $page.params.eventID), {
			next(snapshot) {
				event.set(snapshot.data() ?? (null as any));
			}
		});
		return function () {
			eventSub();
		};
	});
</script>

{#if $event}
	<slot />
{:else if $event === null}
	Page 404: not found
{:else}
	Loading...
{/if}
