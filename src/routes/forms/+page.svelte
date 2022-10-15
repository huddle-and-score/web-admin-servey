<script lang="ts">
	import { config } from '$lib/state';
	import { getFirebase } from '$lib/firebase/firebase';
	import { deleteField, updateDoc } from 'firebase/firestore';
	import { configRef } from '$lib/firebase/event';
	import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	let edit: string | undefined;
	let newForm = false;
	let loading = false;
	async function updateForm() {
		const firebase = getFirebase();
		loading = true;
		try {
			let formID = edit ?? id;
			let image: string | undefined = undefined;
			if (poster && poster.length === 1) {
				const posterRef = ref(firebase.storager, 'Forms/' + formID + '/Poster');
				await uploadBytes(posterRef, poster[0]);
				image = await getDownloadURL(posterRef);
			}
			updateDoc(configRef, {
				['forms.' + formID + '.title']: title,
				['forms.' + formID + '.url']: url,
				...(image ? { ['forms.' + formID + '.poster']: image } : {})
			});
			edit = undefined;
			newForm = false;
		} catch (e) {
			console.error(e);
		}
		loading = false;
	}
	let id = '';
	let title = '';
	let poster: FileList | undefined;
	let url = '';
	async function deleteForm(formID: string) {
		const firebase = getFirebase();
		loading = true;
		try {
			const posterRef = ref(firebase.storager, 'Forms/' + formID + '/Poster');
			await deleteObject(posterRef);
			await updateDoc(configRef, { ['forms.' + formID]: deleteField() });
			edit = undefined;
			newForm = false;
		} catch (e) {
			console.error(e);
		}
		loading = false;
	}
</script>

{#if newForm}
	<form on:submit|preventDefault={updateForm}>
		<h1 class="text-2xl font-semibold">New Form</h1>
		<div class="field">
			<label for="title">Title</label>
			<input id="title" bind:value={title} />
			{#if !title}
				<p class="err">Enter a Title</p>
			{/if}
		</div>
		<div class="field">
			<label for="path">Path Name</label>
			<input id="path" bind:value={id} />
			{#if !id || /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/.test(id)}
				<p class="err">Enter valid a Path name</p>
			{/if}
		</div>
		<div class="field">
			<label for="poster">Display Image</label>
			<input bind:files={poster} type="file" id="poster" />
		</div>
		<div class="field">
			<label for="url">Form Url</label>
			<input type="url" bind:value={url} id="url" />
		</div>
		<div class="flex justify-around">
			<button
				on:click={() => (newForm = false)}
				class="p-3 rounded border mt-5 disabled:bg-opacity-50 disabled:cursor-not-allowed"
				disabled={loading}
			>
				Cancle
			</button>
			<button type="submit" disabled={!url || !title || loading || !poster || poster.length !== 1}>
				Submit
			</button>
		</div>
	</form>
{:else}
	<button
		class="w-full cursor-pointer mt-3 border-2 border-gray-700 border-dashed rounded-xl p-3 text-xl"
		disabled={loading}
		on:click={() => {
			title = '';
			url = '';
			poster = undefined;
			id = '';
			edit = undefined;
			newForm = true;
		}}
	>
		➕ Create Form
	</button>
{/if}
{#each Object.entries($config.forms) as [formID, form]}
	<div class="mt-5">
		<div class="bg-base2 border rounded-lg shadow-xl">
			<h2 class="text-xl mx-3 items-end font-bold py-2 flex justify-between">
				{form.title}
				<div>
					<span class="text-xs block font-medium">/{formID}</span>
					{#if !newForm}
						<button
							disabled={loading}
							on:click={() => {
								title = form.title;
								poster = undefined;
								url = form.url;
								edit = formID;
							}}
							class="text-sm text-pink-500 block font-medium underline text-right w-full"
						>
							Edit
						</button>
					{/if}
				</div>
			</h2>
			<img
				src={form.poster}
				alt={form.title}
				class="w-full {edit === formID ? '' : 'rounded-b-lg'} block object-cover"
			/>
			{#if edit === formID}
				<form on:submit|preventDefault={updateForm}>
					<div class="field">
						<label for="title">Title</label>
						<input id="title" bind:value={title} />
						{#if !title}
							<p class="err">Enter a Title</p>
						{/if}
					</div>
					<div class="field">
						<label for="poster">Display Image</label>
						<input bind:files={poster} type="file" id="poster" />
					</div>
					<div class="field">
						<label for="url">Form Url</label>
						<input type="url" bind:value={url} id="url" />
					</div>
					<div class="flex justify-around">
						<button
							on:click={() => (edit = undefined)}
							disabled={loading}
							class="p-3 rounded border mt-5 disabled:bg-opacity-50 disabled:cursor-not-allowed"
						>
							Cancle
						</button>
						<button
							on:click={() => deleteForm(formID)}
							disabled={loading}
							class="p-3 rounded bg-red-500 text-white mt-5 disabled:bg-opacity-50 disabled:cursor-not-allowed"
						>
							Delete
						</button>
						<button
							type="submit"
							disabled={!url ||
								!title ||
								loading ||
								(title === form.title && url === form.url && (!poster || poster.length !== 1))}
						>
							Submit
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/each}
