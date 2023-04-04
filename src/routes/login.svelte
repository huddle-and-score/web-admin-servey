<script lang="ts">
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { getFirebase } from '$lib/firebase/firebase';
	let email = '';
	let password = '';
	let loading = false;
	let err: any;
	async function logIn() {
		loading = true;
		try {
			await signInWithEmailAndPassword(getFirebase().auth, email.trim(), password.trim());
		} catch (e) {
			err = e;
			console.error(e);
		}
		loading = false;
	}
</script>

<h1 class="pt-3 text-3xl underline">Play Pro Admin Site</h1>

<form on:submit|preventDefault={logIn}>
	<div class="field">
		<label for="email">Email Address</label>
		<input bind:value={email} id="email" />
	</div>
	<div class="field">
		<label for="pass">Password</label>
		<input bind:value={password} type="password" id="pass" />
	</div>
	<p class="err">{err ?? ''}</p>
	<button disabled={loading} type="submit">
		{loading ? 'Loading...' : 'Submit'}
	</button>
</form>
