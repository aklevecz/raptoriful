<script>
	import BasicGenerator from "../generate/basic-generator.svelte";
    import generate from "$lib/stores/generate.svelte";
    import IdbImgItem from "$lib/components/idb/idb-img-item.svelte";

</script>
<div class="container">
    <h1>Make your own Bao dream</h1>
    <div style="margin-bottom:1rem;">Generate your own Bao dream and see it come to life at the show!</div>
    <BasicGenerator />
    {#if generate.state.cachedImgs.length}
        <h2>Your Baos</h2>
        <div class="generated-img-container">
            {#each generate.state.cachedImgs as imgObject (imgObject.id)}
                <IdbImgItem {imgObject} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .container {
        margin-bottom:2rem;
        display:flex;
        flex-direction:column;
        /* gap:1rem; */
    }
    h1 {
        margin:0;
    }
    .generated-img-container {
        display: flex;
        flex-wrap: wrap;
        gap:1rem;
    }
</style>