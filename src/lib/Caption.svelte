<script lang="ts">
	import type { EventPlayer, EventTeam } from './firebase/db';
	import type { Suggestions } from './utility';
	export let caption: string;
	export let suggestions: Suggestions;
	let textarea: HTMLTextAreaElement;
</script>

<div class="field">
	<label for="caption">Caption</label>
	<textarea
		bind:this={textarea}
		bind:value={caption}
		class="min-w-full min-h-[150px]"
		id="caption"
	/>
	<label for="caption">Suggestions</label>
	<div
		class="hide-scroll-bar mt-0.5 border items-start overflow-x-auto overflow-y-hidden rounded flex space-x-2 px-1"
	>
		<div class="h-10" />
		{#if suggestions.type === 'team'}
			{#each suggestions.suggestion as suggestion}
				<button
					on:click={function () {
						caption = suggestion.setStr;
						textarea.focus();
					}}
					class="px-2 whitespace-nowrap h-10 my-1 bg-gray-300 rounded-lg flex items-center"
				>
					<img src={suggestion.val.logo} alt={suggestion.val.name} class="rounded-full h-9" />
					<span class="ml-1">{suggestion.val.name}</span>
				</button>
			{/each}
		{:else}
			{#each suggestions.suggestion as suggestion}
				<button
					on:click={function () {
						caption = suggestion.setStr;
						textarea.focus();
					}}
					class="px-2 whitespace-nowrap h-10 my-1 bg-gray-300 rounded-lg flex items-center"
				>
					<img
						src={suggestion.val.displayImage}
						alt={suggestion.val.name}
						class="rounded-full h-9"
					/>
					<span class="ml-1">{suggestion.val.name}</span>
				</button>
			{/each}
		{/if}
	</div>
	{#if !caption}
		<p class="err">Enter a Caption</p>
	{/if}
</div>
