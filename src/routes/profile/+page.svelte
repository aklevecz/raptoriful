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
	import SectionHeading from '$lib/components/section-heading.svelte';

	/** @type {{data:import('./$types').PageData}} */
	const { data } = $props();

	let imgEl = $state();

	let imgId = $derived(raptorSvelte.state.favoriteBao);
	$effect(() => {
		if (modelStorage && imgId) {
			modelStorage.getGeneratedImg(imgId).then((imgEntry) => {
				imgEl.src = imgEntry.base64Url;
			});
		} else {
			// imgEl.src = '/smiler.svg';
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
		<SectionHeading>Profile</SectionHeading>
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
		<div class="event_item_container">
			{#each rsvp.state.user.rsvps as userRsvp}
				<div class="event-item">
					<div class="event_item_name">{eventData[userRsvp.event_name].name}</div>
					<div class="event_item_date">
						{formatDate(new Date(eventData[userRsvp.event_name].date))}
					</div>
				</div>
			{/each}
		</div>
		<h3>User</h3>
		<h4 class="user-phone">Phone: {auth.state.user.phoneNumber}</h4>
		<button class="logout btn" onclick={auth.logout}>Logout</button>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		min-height: 90vh;
		padding: 1rem;
		padding-top: 0;
	}
	.generated-img-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
	}
	.user-phone {
		/* text-align: center; */
		margin-top: 0rem;
		margin-bottom: 0.5rem;
		font-weight: 400;
	}
	.event-item {
		border: 1px solid var(--primary-color);
		border-top: none;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem;
	}

	.event_item_container > .event-item:first-child {
		border-top: 1px solid var(--primary-color);
	}

	.event_item_name {
		flex: 0 0 20%;
		text-transform: capitalize;
	}
	.event_item_date {
		flex: 1 0 auto;
		font-size: 0.75rem;
	}

	button {
		/* margin: auto; */
		display: block;
	}
	.logout {
		/* margin-top: 1rem; */
		background-color: var(--red);
		width: 100px;
	}
	.favorite-bao {
		width: 300px;
		height: 300px;
		margin-bottom: 1rem;
	}
	h3 {
		margin-bottom: 0.5rem;
	}
</style>
