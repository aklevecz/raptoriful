<script>
	import BasicGenerator from '../generate/basic-generator.svelte';
	import generate from '$lib/stores/generate.svelte';
	import IdbImgItem from '$lib/components/idb/idb-img-item.svelte';
	import SectionHeading from '../section-heading.svelte';
</script>

<div class="container">
	<SectionHeading id="generate-scroll-to" class="make-a-dream-nugget">Make a Dream</SectionHeading>
	<h2>Make your own Bao dream</h2>
	<div style="margin-bottom:0.5rem;">
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
		margin: 8px 0 4px;
        font-size: 1.25rem;
	}
	.generated-img-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
</style>
