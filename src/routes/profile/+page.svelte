<script>
	import Raptor from '$lib/components/raptor.svelte';
	import auth from '$lib/stores/auth.svelte';
	import raptor from '$lib/stores/raptor.svelte';
	import rsvp from '$lib/stores/rsvp.svelte';
	import { onMount } from 'svelte';

	import eventData from '$lib/stores/events';
	import { formatDate } from '$lib/utils';
	import generate from '$lib/stores/generate.svelte';
	import IdbImgItem from '$lib/components/idb/idb-img-item.svelte';

	/** @type {{data:import('./$types').PageData}} */
	const { data } = $props();
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
			<Raptor size={270} accent={raptor.state.color} />
		</div>

		<div class="generated-img-container">
			{#each generate.state.cachedImgs as imgObject}
			  <IdbImgItem {imgObject} />
			{/each}
		  </div>
		  
		<h3>your events</h3>
		{#each rsvp.state.user.rsvps as userRsvp}
			<div class="event-item">
				<div>{eventData[userRsvp.event_name].name}</div>
                <div>{formatDate(new Date(eventData[userRsvp.event_name].date))}</div>

			</div>
		{/each}
		<button class="logout btn" onclick={auth.logout}>logout</button>
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
        gap:1rem;
	}
	.user-phone {
		text-align: center;
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
        margin-top: auto;
        background-color: var(--red);
        width: 100px;
    }
</style>
