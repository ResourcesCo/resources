<script>
	import { onMount, getContext } from 'svelte'
  import { key as contextKey } from './E'
	
	export let path
	export let open
	export let close
	export let pair
	export let key
	
	let documentModel = getContext(contextKey)
	let nodeModel = documentModel.forPath(path)
	let nodeContext = (open && 'open') || (close && 'close') || (pair && 'pair') || (key && 'key') || (nodeModel.isEmpty && 'empty')
</script>

<style>
	.item {
		display: flex;
		flex-direction: row;
	}
	
	.open, .close, .empty {
		color: gray;
	}
	
	.pair {
		padding: 1px 2px;
		margin: 0 5px;
	}
	.key {
		background-color: #ace;
		padding: 0 4px;
		margin-right: 5px;
		border-radius: 3px;
	}
</style>

<div class={`item ${nodeContext}`}>
	{#if pair}
	<svelte:self key path={path} />
	<svelte:self path={path} />
	{:else if key}
	{nodeModel.key}
	{:else}
	{#if nodeModel.isObject}
	{#if nodeModel.isEmpty}
	{'{}'}
	{:else}
	{#if open}
	{'{'}
	{:else if close}
	{'}'}
	{:else}
	<svelte:self path={path} open />
	{#each nodeModel.keys as key}
	<svelte:self pair path={[...path, key]} />
	{/each}
	<svelte:self path={path} close />
	{/if}
	{/if}
	{:else}
	{nodeModel.value}
	{/if}
	{/if}
</div>