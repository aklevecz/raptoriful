<script>
	import generate from '$lib/stores/generate.svelte';
	import ProgressBar from '$lib/components/progress-bar.svelte';

	let { model = 'aklevecz/bao-flux' } = $props();

	let generatedImg = $derived(generate.state.outputs[0]);
	let text = $state('');

	async function handleClick() {
		generate.reset();
		try {
			let data = await generate.createGeneration(text, model);
			if (!data?.id) {
				throw new Error('id is missing');
			}
			generate.pollGeneration(data.id);
		} catch (/** @type {*} */ e) {
			alert(e.message);
		}
	}
</script>

{#if generatedImg}
	<img class="generated_img" src={generatedImg} alt="Generated" />{/if}
{#if !generatedImg && generate.state.generating}<img
		class="egg_img"
		class:pulse={generate.state.generating}
		src="/egg.svg"
		alt="egg"
	/>{/if}
{#if generate.state.generating}<div>
		{generate.state.percentage === 0 ? 'starting...' : generate.state.percentage}
	</div>
	<div style="width:70%;margin-bottom:1rem;">
		<ProgressBar />
	</div>
{/if}
<textarea
	placeholder="Enter prompt here..."
	bind:value={text}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	disabled={generate.state.generating}>{text}</textarea
>
<button
	style="width:200px;"
	class="btn"
	class:fade-pulse={generate.state.generating}
	disabled={generate.state.generating}
	onclick={handleClick}>{generate.state.generating ? 'Generating...' : 'Generate'}</button
>

<style>
	textarea {
		padding: 0.5rem;
		font-size: 1rem;
		margin: 1rem 0;
		width: 80%;
		height: 100px;
		max-width: 500px;
		background: none;
		border: 2px solid white;
	}

	.generated_img {
		width: 100%;
		width: 500px;
		margin-bottom: 1rem;
	}
	.egg_img {
		width: 100px;
		margin: 3rem auto 3rem;
		display: block;
	}
</style>
