<script>
	import auth from '$lib/stores/auth.svelte';
	import rsvp from '$lib/stores/rsvp.svelte';
	import { onMount } from 'svelte';

	import IdbImgItem from '$lib/components/idb/idb-img-item.svelte';
	import modelStorage from '$lib/idb';
	import eventData from '$lib/stores/events';
	import generate from '$lib/stores/generate.svelte';
	import raptorSvelte from '$lib/stores/raptor.svelte';
	import { formatDate } from '$lib/utils';

	/** @type {{data:import('./$types').PageData}} */
	const { data } = $props();

	let imgEl = $state();

	let imgId = $derived(raptorSvelte.state.favoriteBao)
	$effect(() => {
		if (modelStorage && imgId) {
			console.log(imgId)
			let imgEntry = modelStorage.getGeneratedImg(imgId).then((imgEntry) => {
				imgEl.src = imgEntry.base64Url;
			});
		}
	});

	onMount(() => {
		auth.init({ authorized: data.authorized, user: data.user });
		rsvp.init(data.event.name);
		// raptor.init();
	});
</script>

<div class="container">
	{#if auth.state.authorized}
		<h2 class="user-phone">{auth.state.user.phoneNumber}</h2>
		<div style="display:flex;justify-content:center;">
			<!-- <Raptor size={270} accent={raptor.state.color} /> -->
			<img class="favorite-bao" bind:this={imgEl} alt="favorite bao" />
		</div>

		<div class="generated-img-container">
			{#each generate.state.cachedImgs as imgObject}
				<IdbImgItem {imgObject} />
			{/each}
		</div>

		<h3>Event Log</h3>
		{#each rsvp.state.user.rsvps as userRsvp}
			<div class="event-item">
				<div>{eventData[userRsvp.event_name].name}</div>
				<div>{formatDate(new Date(eventData[userRsvp.event_name].date))}</div>
			</div>
		{/each}
		<button class="logout btn" onclick={auth.logout}>Logout</button>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		min-height: 90vh;
		padding: 1rem;
	}
	.generated-img-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.user-phone {
		text-align: center;
		margin-top:0;
	}
	.event-item {
		display: flex;
		gap: 1rem;
	}
	button {
		/* margin: auto; */
		display: block;
	}
	.logout {
		margin-top: 1rem;
		background-color: var(--red);
		width: 100px;
	}
	.favorite-bao {
		width: 300px;
		height: 300px;
		margin-bottom: 1rem;
	}
	h3 {
		margin-bottom:.5rem;
	}
</style>
