<script lang="ts">
	import type { beforeContent } from './utility';
	import { page } from '$app/stores';

	export let connection: beforeContent;
</script>

{#each connection as val, i}
	{#if val.type === 'player'}
		{#if !connection.slice(0, i).some((x) => x.type === 'player' && x.player.id === val.player.id)}
			<a
				href="/event/{$page.params.eventID}/players/{val.player.id}"
				class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
			>
				<div class="w-2 h-20 -mt-3" style="background-color: {val.player.team.color}" />
				<img
					alt={val.player.name}
					class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
					src={val.player.displayImage}
				/>
				<div class="flex justify-between w-full">
					<div>
						<span class="block">
							{val.player.name}
						</span>
						<span class="block">
							{val.player.team.acronym}
						</span>
					</div>
				</div>
			</a>
		{/if}
	{:else if val.type === 'team'}
		{#if !connection.slice(0, i).some((x) => x.type === 'team' && x.team.id === val.team.id)}
			<a
				href="/event/{$page.params.eventID}/teams/{val.team.id}"
				class="w-full h-20 flex cursor-pointer mt-3 border border-gray-700 rounded-xl p-3 text-xl"
			>
				<div class="w-2 h-20 -mt-3" style="background-color: {val.team.color}" />
				<img
					alt={val.team.name}
					class="p-1 mx-4 w-14 h-14 rounded-full ring-2 ring-white"
					src={val.team.logo}
				/>
				<div class="flex justify-between w-full">
					<div>
						<span class="block">
							{val.team.name}
						</span>
						<span class="block">
							{val.team.acronym}
						</span>
					</div>
				</div>
			</a>
		{/if}
	{/if}
{/each}
