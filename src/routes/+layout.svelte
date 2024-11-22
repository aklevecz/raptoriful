<script>
	import { formatDate } from '$lib/utils';
	import Nav from '$lib/components/nav.svelte';
	import { onMount } from 'svelte';
	import modelStorage from '$lib/idb';
	import generate from '$lib/stores/generate.svelte';
	import "../animations.css";
	import raptorSvelte from '$lib/stores/raptor.svelte';

	/** @type {{data:import('./$types').LayoutData, children: any}} */
	let { children, data } = $props();
	const { event } = data;
	onMount(() => {
		raptorSvelte.init()
		modelStorage.init().then(() => {
			// modelSvelte.init();
			generate.init();
		});
	});
</script>

<svelte:head>
	<meta name="og:title" content={event.name} />
	<meta name="og:description" content={`${formatDate(new Date(event.date))} - ${event.location}`} />
	<meta name="og:image" content={event.videoGif} />
</svelte:head>
<!-- <img style="height:50px;" src="/title_1.svg" alt="rsvrptr" /> -->
{@render children()}
<Nav />

<style>
	:root {
		--red: #ff4a4a;
		--primary-color: #333333;
		--secondary-color: #fff;
		--accent-color: #b7c0c5;
		--purple: #965cff;
		--green: #7bff7b;
		--yellow: #f7ed37;
	}
	/* .noto-sans-<> {
		font-family: 'Noto Sans', sans-serif;
		font-optical-sizing: auto;
		font-weight: <weight>;
		font-style: normal;
		font-variation-settings: 'wdth' 100;
	} */
	:global(body) {
		background-color: var(--accent-color);
		color: var(--primary-color);
		font-family: 'Noto Sans', sans-serif;
		font-weight: 400;
		font-style: normal;
	}
	:global(input) {
		background-color: var(--secondary-color);
		font-size: 16px;
		border: none;
		border-radius: 4px;
		padding: 8px 16px;
	}
	:global(button.btn) {
		background-color: var(--primary-color);

		color: var(--secondary-color);
		font-size: 16px;
		font-weight: 600;
		border: none;
		border-radius: 4px;
		padding: 8px 16px;
		cursor: pointer;
		/* width: 130px; */
	}
	:global(button.btn.lg) {
		font-size: 24px;
		padding: 16px 32px;
		/* width: 220px; */
	}
	:global(button.btn_icon) {
		background: none;
		border: none;
	}
	:global(button.btn.neg) {
		background-color: var(--red);
	}
</style>
