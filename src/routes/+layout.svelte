<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { EventRef } from '$lib/db';
	import { event, auth } from '$lib/state';
	import { getFirebase } from '$lib/firebase/firebase';
	import { onSnapshot } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import Login from './login.svelte';

	onMount(function () {
		const eventSub = onSnapshot(EventRef, {
			next(snapshot) {
				event.set(snapshot.data()!);
			}
		});
		const authSub = onAuthStateChanged(getFirebase().auth, function (user) {
			auth.set(!!user);
		});
		return function () {
			eventSub();
			authSub();
		};
	});
</script>

<div class="app max-w-[550px] min-w-[332px] min-h-screen pb-10 mx-auto border-x px-3">
	{#if !$auth}
		<Login />
	{:else}
		<nav class="sticky text-4xl top-0 bg-white w-full h-16 border-b mb-5 py-2 flex justify-between">
			<button onclick="history.back()">🔙</button>
			<a href="/">📃</a>
			<button onclick="history.forward()">🔜</button>
		</nav>
		{#if $event}
			<slot />
		{:else}
			Loading...
		{/if}
	{/if}
</div>
