<script>
	import { read } from '$app/server';
	import AuthFlow from '$lib/components/auth-flow.svelte';
	import GeneratorSection from '$lib/components/containers/generator-section.svelte';
	import Header from '$lib/components/hero/header.svelte';
	import Raptor from '$lib/components/raptor.svelte';
	import auth from '$lib/stores/auth.svelte';
	import events from '$lib/stores/events';
	import rsvp from '$lib/stores/rsvp.svelte';
	import { generateScrollTo } from '$lib/utils';
	import { onMount } from 'svelte';

	/** @type {{data:import('./$types').PageData}} */
	const { data } = $props();
	const { event } = data;
	onMount(() => {
		auth.init({ authorized: data.authorized, user: data.user });
		rsvp.init(event.name);
		rsvp.getAllRsvps(event.name);
	});

	/** @type {HTMLVideoElement} */
	let video;
	let forward = true;
	/** @type {*} */
	let interval;

	function pingPong() {
		if (!video) {
			return;
		}
		if (forward && video.currentTime === video.duration) {
			forward = false;
			interval = setInterval(() => {
				if (video && video.currentTime) {
					video.currentTime -= 0.1;
				} else {
					clearInterval(interval);
				}
			}, 50);
		} else if (!forward && video.currentTime === 0) {
			forward = true;
			clearInterval(interval);
			video.play();
		}
	}

	let isRSVPed = $derived(rsvp.state[event.name]?.status === 'rsvped');
	let rsvpList = $derived(rsvp.state[event.name]?.rsvps);

	async function onRSVP() {
		await rsvp.createRSVP(event.name);
		setTimeout(() => {
			generateScrollTo();
		}, 10);
	}
</script>

<div class="container">
	<div class="header-info">
		<Header {event} />
		<div class="header-info-desc">
			<div style="margin-bottom:.5rem;">One last shindig in the Lacy Studio</div>
			<div>Free drinks, snacks, pizza, & weird stuff to look at</div>

			<!-- <div>But you are still encouraged to dream</div> -->
		</div>
		<div class="header-info-featuring"></div>
		<video
			bind:this={video}
			ontimeupdate={pingPong}
			playsinline
			autoplay
			muted
			class="promo-video"
			src={events[event.name].video}
		></video>

		<!-- <div style="display:flex;justify-content:center;"><Raptor size={200} /></div> -->
		<div class="rsvp-section">
			<h3>
				{event.noun} collected
				<!-- <span style="color:var(--green); font-size:.75rem;margin-left:.5rem;display:{isRSVPed ? 'unset' : 'none'}">(You are RSVPed!)</span > -->
			</h3>

			<div class="raptor-container">
				{#if rsvpList}
					{#each rsvpList as raptor}
						{#if event.name === 'zeitgeist'}
							<div class="rsvp-raptor">
								<div>
									<Raptor size={50} accent={`#${raptor.color}`} />
								</div>
							</div>
						{/if}
						{#if event.name === 'flowers'}
							<div>
								<img alt="event icon" class="rsvp-icon" src={event.icon} />
							</div>
						{/if}
						{#if event.name === 'bao3'}
							<div style="display:flex;">
								<img
									onerror={function () {
										this.src = '/smiler.svg';
										// @ts-ignore
										this.style.width = '50px';
									}}
									src={`img?id=${raptor.phone_number}_thumb`}
									style="border-radius:50%;"
									alt="Generated"
								/>
							</div>
						{/if}
					{/each}
				{/if}
				{#if !rsvp.state[event.name] || rsvp.state[event.name]?.rsvps.length === 0}
					<div>no one has RSVPed... yet!</div>
				{/if}
			</div>
			{#if auth.state.authorized}
				<div class="rsvp-button-container">
					<!-- {#if isRSVPed}
						<button class="btn cancel" onclick={() => rsvp.unRSVP(event.name)}>
							{#if rsvp.fetching}...{:else}unRSVP{/if}</button
						>
					{/if} -->

					{#if rsvp.state[event.name]?.status !== 'rsvped'}
						<button class="btn lg fixed-bottom-button" onclick={onRSVP}
							>{#if rsvp.fetching}...{:else}Show off your dream{/if}</button
						>
					{/if}

					{#if rsvp.state[event.name]?.status === 'failed'}
						<div>hrmm something went wrong RSVPing...</div>
					{/if}
				</div>
			{/if}
			<div class="auth-wrapper">
				<AuthFlow eventName={event.name} />
			</div>
		</div>
	</div>

	{#if isRSVPed}
		<GeneratorSection />
	{/if}
</div>

<style>
	h3 {
		font-size: 1rem;
	}
	.container {
		display: flex;
		flex-direction: column;
		justify-self: center;
		min-height: 90vh;
		padding: 0.5rem;
		/* padding-bottom: 5rem; */
		box-sizing: border-box;
	}

	.header-info {
		min-width: 340px;
		margin-bottom: 1rem;
	}

	.header-info-desc {
		margin-top: 1rem;
		padding: 0 0.6rem;
	}

	.header-info-featuring {
		margin-top: 0.75rem;
	}

	@media (min-width: 768px) {
		.container {
			flex-direction: row;
			/* align-items: center; */
			max-width: 1280px;
			margin: 0 auto;
			gap: 120px;
		}
		.header-info {
			/* flex: 0 0 50%; */
		}
	}

	.raptor-container {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin: 1rem 0;
	}
	.promo-video {
		width: 100%;
		max-width: 500px;
		min-height: 300px;
		margin: 0.5rem 0 1rem;
		border-radius: 40%;
	}
	h3 {
		margin: 0;
	}
	.rsvp-section {
		margin: 2rem 0;
	}
	.rsvp-raptor {
		flex: 0 1 20px;
	}
	.rsvp-button-container {
		margin-top: 1.5rem;
	}
	.rsvp-icon {
		width: 50px;
	}
	.fixed-bottom-button {
		position: fixed;
		bottom: 10px;
	}
	.cancel {
		background-color: var(--red);
		margin-top: 0.5rem;
	}
	.auth-wrapper {
		position: fixed;
		bottom: 10px;
	}

	@media (min-width: 768px) {
		.auth-wrapper {
			position: static;
		}
	}
</style>
