<script>
	import BasicGenerator from '../generate/basic-generator.svelte';
	import generate from '$lib/stores/generate.svelte';
	import IdbImgItem from '$lib/components/idb/idb-img-item.svelte';
</script>

<div class="container">
	<div id="generate-scroll-to" class="make-a-dream-nugget">Make a Dream</div>
	<h2>Make your own Bao dream</h2>
	<div style="margin-bottom:1rem;">
		Generate your own Bao dreams and pick your favorite to show off!
	</div>
	<BasicGenerator />
	{#if generate.state.cachedImgs.length}
		<h2 style="margin:2rem 0 .5rem;">Your Baos</h2>
		<div class="generated-img-container">
			{#each generate.state.cachedImgs as imgObject (imgObject.id)}
				<IdbImgItem {imgObject} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		/* gap:1rem; */
	}
	h2 {
		margin: 0px;
	}
	.generated-img-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.make-a-dream-nugget {
		height: 55px;
		color: white;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-bottom: 0.75rem;
		border: 1px solid;
	}
</style>
