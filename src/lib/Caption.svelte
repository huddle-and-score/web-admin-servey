<script lang="ts">
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
	{#if !suggestions.suggestion.length}
		<div class="h-[7.5rem] font-bold text-center pt-[3rem]">No Suggestions</div>
	{:else}
		<div class="hide-scroll-bar overflow-x-auto flex h-[7.5rem]">
			{#each suggestions.type === 'team' ? suggestions.suggestion.map( (x) => ({ setStr: x.setStr, img: x.val.logo, name: x.val.name, isTeam: true }) ) : suggestions.suggestion.map( (x) => ({ setStr: x.setStr, img: x.val.displayImage, name: x.val.name, isTeam: false }) ) as suggestion}
				<div
					on:click={function () {
						caption = suggestion.setStr;
						textarea.focus();
					}}
					class="flex-none py-6 px-3 first:pl-6 last:pr-6"
				>
					<div class="flex flex-col items-center justify-center gap-3">
						<img src={suggestion.img} alt={suggestion.name} class="w-14 h-14 rounded-full" />
						<strong class="text-slate-900 text-xs font-medium">{suggestion.name}</strong>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	{#if !caption}
		<p class="err">Enter a Caption</p>
	{/if}
</div>
