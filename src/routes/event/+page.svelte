<script lang="ts">
	import { config, event } from '$lib/state';
	import { getFirebase } from '$lib/firebase/firebase';
	import { doc, runTransaction } from 'firebase/firestore';
	import { configRef, eventColl, parseConfigDocument } from '$lib/firebase/event';
	import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
	let edit: string | undefined;
	let newEvent = false;
	let loading = false;
	async function updateEvent() {
		const firebase = getFirebase();
		loading = true;
		try {
			await runTransaction(firebase.db, async function (transaction) {
				const config = await transaction
					.get(configRef)
					.then((x) => parseConfigDocument(x.data() as any));
				let eventID = edit;
				if (eventID === undefined) {
					const ids = config.sortedEvent.map((x) => x.id);
					let i = 1;
					while (true) {
						eventID = '00' + i++;
						eventID = eventID.substring(eventID.length - 3);
						if (!ids.includes(eventID)) break;
					}
					transaction.set(doc(eventColl, eventID), { fixtures: {}, players: {}, teams: {} });
				}
				let image: string | undefined = undefined;
				if (poster && poster.length === 1) {
					const posterRef = ref(firebase.storager, 'Event/' + eventID + '/Poster');
					await uploadBytes(posterRef, poster[0]);
					image = await getDownloadURL(posterRef);
				}

				transaction.update(configRef, {
					['events.' + eventID + '.title']: title,
					['events.' + eventID + '.hidden']: hidden,
					['events.' + eventID + '.time']: time,
					...(image ? { ['events.' + eventID + '.poster']: image } : {})
				});
			});
			edit = undefined;
			newEvent = false;
		} catch (e) {
			console.error(e);
		}
		loading = false;
	}
	let title = '';
	let hidden = false;
	let poster: FileList | undefined;
	let time = '';
</script>

{#if newEvent}
	<form on:submit|preventDefault={updateEvent}>
		<h1 class="text-2xl font-semibold">New Event</h1>
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
			{#if !poster || poster?.length === 0}
				<p class="err">Select a Display Image</p>
			{/if}
		</div>
		<div class="field">
			<label for="time">Timming</label>
			<input type="datetime-local" bind:value={time} id="time" />
		</div>
		<div class="flex justify-around">
			<button
				on:click={() => (newEvent = false)}
				class="p-3 rounded border mt-5 disabled:bg-opacity-50 disabled:cursor-not-allowed"
				disabled={loading}
			>
				Cancle
			</button>
			<button type="submit" disabled={!time || !title || !poster || poster.length !== 1 || loading}>
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
			hidden = false;
			poster = undefined;
			time = '';
			edit = undefined;
			newEvent = true;
		}}
	>
		➕ Create Event
	</button>
{/if}
{#each $config.sortedEvent as event}
	<div class="mt-5">
		<div class="bg-base2 border rounded-lg shadow-xl">
			<h2 class="text-xl mx-3 items-end font-bold py-2 flex justify-between">
				<span>
					{!event.hidden ? '👁' : ''}
					<a href="/event/{event.id}" class="underline">{event.title}</a>
				</span>
				<div>
					<span class="text-xs block font-medium">{event.displayDate}</span>
					{#if !newEvent}
						<button
							disabled={loading}
							on:click={() => {
								title = event.title;
								hidden = event.hidden ?? false;
								poster = undefined;
								time = event.time;
								edit = event.id;
							}}
							class="text-sm text-pink-500 block font-medium underline text-right w-full"
						>
							Edit
						</button>
					{/if}
				</div>
			</h2>
			<img
				src={event.poster}
				alt={event.title}
				class="w-full {edit === event.id ? '' : 'rounded-b-lg'} block object-cover"
			/>
			{#if edit === event.id}
				<form on:submit|preventDefault={updateEvent}>
					<div class="field">
						<label for="title">Title</label>
						<input id="title" bind:value={title} />
						{#if !title}
							<p class="err">Enter a Title</p>
						{/if}
					</div>
					<div class="field">
						<label for="display type">Display</label>
						<select bind:value={hidden} id="display type">
							<option value={true}>Hide</option>
							<option value={false}>Show</option>
						</select>
					</div>
					<div class="field">
						<label for="poster">Display Image</label>
						<input bind:files={poster} type="file" id="poster" />
					</div>
					<div class="field">
						<label for="time">Timming</label>
						<input type="datetime-local" bind:value={time} id="time" />
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
							type="submit"
							disabled={!time ||
								!title ||
								loading ||
								(title === event.title &&
									time === event.time &&
									hidden === event.hidden &&
									(!poster || poster.length !== 1))}
						>
							Submit
						</button>
					</div>
				</form>
			{/if}
		</div>
	</div>
{/each}
