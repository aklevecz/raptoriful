<script>
	import generate from '$lib/stores/generate.svelte';
	import ProgressBar from '$lib/components/progress-bar.svelte';
	import Modal from '../modal.svelte';

	let { model = 'aklevecz/bao-flux' } = $props();

	let showModal = $state(false);

	let generatedImg = $derived(generate.state.outputs[0]);
	let text = $state('');

	let modals = {
		missingBao: {
			title: 'Missing Bao',
			content: ['Please include <span data-id="hue-rotate">Bao</span> in your prompt.', 'For example: Bao riding a triceratops']
		},
		missingText: {
			title: 'Missing Text',
			content: ['Please enter some text.', 'Like literally any text-- what do you think you were going to generate?']
		}
	};

	let modalInfo = $state(modals.missingBao);

	async function handleClick() {
		if (text === '') {
			modalInfo = modals.missingText;
			showModal = true;
			return;
		}
		if (text.toLowerCase().includes('bao') === false) {
			console.log('mising bao');
			modalInfo = modals.missingBao;
			showModal = true;
			return;
		}
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
{#if generate.state.generating}
	<div class="progress-container">
		<div>
			{generate.state.percentage === 0 ? 'Warming up generator...' : generate.state.percentage}
		</div>
		<!-- <div style="width:70%;margin-bottom:1rem;"> -->
		<ProgressBar />
		<!-- </div> -->
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

<Modal bind:showModal title={modalInfo.title}>
  {#each modalInfo.content as contentBlock}
	<p>
		{@html contentBlock}
	</p>
  {/each}
  {#if modalInfo.title === 'Missing Bao'}'<img class="example_image" src="/bao/bao_triceratops.webp" alt="Bao riding a triceratops" />{/if}
	<button class="btn" onclick={() => (showModal = false)}>Ok</button>
</Modal>

<style>
	textarea {
		padding: 0.5rem;
		font-size: 1rem;
		margin: 1rem 0;
		width: 80%;
		height: 100px;
		max-width: 500px;
		background: none;
    color: white;
    background: #00ffe229;
		border: 1px solid white;
	}

	.generated_img {
		width: 100%;
		max-width: 500px;
		margin-bottom: 1rem;
	}

	.egg_img {
		width: 100px;
		margin: 3rem auto 3rem;
		display: block;
	}

	.progress-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		width: 100%;
	}

	textarea::placeholder {
		color: rgba(255, 255, 255, 0.5); /* semi-transparent white */
		font-style: italic; /* optional: makes the placeholder italic */
	}

  .example_image {
    width: 100%;
  }

 :global([data-id="hue-rotate"]) {
  color: red;
  animation: hue-rotate 2s infinite;
 }

 @keyframes hue-rotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
</style>
