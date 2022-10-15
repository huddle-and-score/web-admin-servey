<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { auth, config } from '$lib/state';
	import { getFirebase } from '$lib/firebase/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import Login from './login.svelte';
	import { onSnapshot } from 'firebase/firestore';
	import { configRef, parseConfigDocument } from '$lib/firebase/event';
	import { page } from '$app/stores';

	onMount(function () {
		const configSub = onSnapshot(configRef, {
			next(snapshot) {
				config.set(parseConfigDocument(snapshot.data() as any));
			}
		});
		const authSub = onAuthStateChanged(getFirebase().auth, function (user) {
			auth.set(user);
		});
		return function () {
			configSub();
			authSub();
		};
	});
</script>

<div class="app max-w-[550px] min-w-[332px] min-h-screen pb-10 mx-auto border-x px-1">
	<nav
		class="sticky z-10 text-4xl top-0 bg-white w-full h-16 border-b mb-5 py-2 flex justify-between"
	>
		<button on:click={() => history.back()}>🔙</button>
		<a href="/{$page.params.eventID ? 'event/' + $page.params.eventID : ''}">📃</a>
		<button on:click={() => history.forward()}>🔜</button>
	</nav>
	{#if $auth?.isAnonymous === false}
		{#if $config}
			<slot />
		{:else}
			Loading...
		{/if}
	{:else}
		<Login />
	{/if}
</div>
