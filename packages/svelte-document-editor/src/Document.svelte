<script>
	import { onMount, setContext } from 'svelte'
	import { key } from './E'
	import DocumentModel from './DocumentModel'
	import Node from './Node.svelte'
	export let value = {}
	
	setContext(key, new DocumentModel({value}))
</script>

<Node path={[]} />