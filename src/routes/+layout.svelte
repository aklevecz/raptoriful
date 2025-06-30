<script>
	import Nav from '$lib/components/nav.svelte';
	import appSvelte from '$lib/stores/app.svelte';
	import { formatDate } from '$lib/utils';
	import { onMount } from 'svelte';
	import '../animations.css';

	/** @type {{data:import('./$types').LayoutData, children: any}} */
	let { children, data } = $props();
	const { event } = data;
	onMount(() => {
		appSvelte.initUsersAndGenerations();
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
		--ocean-bg-primary: #f8fafc;
		--ocean-bg-secondary: #f1f5f9;
		--ocean-bg-tertiary: #e2e8f0;
		--ocean-fg-primary: #1e293b;
		--ocean-fg-secondary: #334155;
		--ocean-fg-muted: #64748b;
		--ocean-accent-primary: #0ea5e9;
		--ocean-accent-secondary: #38bdf8;
		--ocean-accent-tertiary: #7dd3fc;

		/* Desert Sand - Warm & Inviting */
		--sand-bg-primary: #fefce8;
		--sand-bg-secondary: #fef9c3;
		--sand-bg-tertiary: #fef08a;
		--sand-fg-primary: #713f12;
		--sand-fg-secondary: #854d0e;
		--sand-fg-muted: #a16207;
		--sand-accent-primary: #ea580c;
		--sand-accent-secondary: #fb923c;
		--sand-accent-tertiary: #fdba74;

		/* Urban Night - Bold & Contemporary */
		--night-bg-primary: #18181b;
		--night-bg-secondary: #27272a;
		--night-bg-tertiary: #3f3f46;
		--night-fg-primary: #fafafa;
		--night-fg-secondary: #e4e4e7;
		--night-fg-muted: #a1a1aa;
		--night-accent-primary: #d946ef;
		--night-accent-secondary: #e879f9;
		--night-accent-tertiary: #f0abfc;

		/* Forest Mist - Natural & Calming */
		--forest-bg-primary: #f0fdf4;
		--forest-bg-secondary: #dcfce7;
		--forest-bg-tertiary: #bbf7d0;
		--forest-fg-primary: #064e3b;
		--forest-fg-secondary: #065f46;
		--forest-fg-muted: #047857;
		--forest-accent-primary: #6d28d9;
		--forest-accent-secondary: #7c3aed;
		--forest-accent-tertiary: #8b5cf6;

		/* Sunset Glow - Dramatic & Bold */
		--sunset-bg-primary: #fff1f2;
		--sunset-bg-secondary: #ffe4e6;
		--sunset-bg-tertiary: #fecdd3;
		--sunset-fg-primary: #881337;
		--sunset-fg-secondary: #9f1239;
		--sunset-fg-muted: #be123c;
		--sunset-accent-primary: #0369a1;
		--sunset-accent-secondary: #0284c7;
		--sunset-accent-tertiary: #0ea5e9;

		/* Midnight Slate - Elegant & Professional */
		--slate-bg-primary: #1e1b4b;
		--slate-bg-secondary: #312e81;
		--slate-bg-tertiary: #3730a3;
		--slate-fg-primary: #e0e7ff;
		--slate-fg-secondary: #c7d2fe;
		--slate-fg-muted: #a5b4fc;
		--slate-accent-primary: #f59e0b;
		--slate-accent-secondary: #fbbf24;
		--slate-accent-tertiary: #fcd34d;

		--red: #ff4a4a;
		--primary-color: #333333;
		--secondary-color: #fff;

		--accent-color: var(--red);
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
		color: var(--night-fg-primary);
		font-family: 'Noto Sans', sans-serif;
		font-weight: 400;
		font-style: normal;
		padding: 0;
		margin: 0;
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
		font-size: 18px;
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
