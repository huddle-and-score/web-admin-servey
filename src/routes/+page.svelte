<script>
	import { signOut } from 'firebase/auth';
	import { getFirebase } from '$lib/firebase/firebase';
</script>

<h1 class="text-3xl font-bold underline">Play Pro Admin Site</h1>

<ul>
	<li><a href="/event">⚽ Events</a></li>
	<li><a href="/forms">📄 Forms</a></li>
</ul>
<button
	class="bg-red-500 mt-72 text-white w-full py-2"
	on:click={() => signOut(getFirebase().auth)}
>
	Logout
</button>

<style>
	ul {
		@apply mt-5 space-y-2;
	}

	a {
		@apply bg-gray-200 rounded-xl cursor-pointer p-3 block w-full h-full;
	}
</style>
