<script>
	import { sineIn, sineOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	/** @type {{title:string, content?:string, showModal:boolean, variant?: string, children: any}}*/
	let { title, content, showModal = $bindable(), variant, children } = $props();

	function closeModal() {
		showModal = false;
	}
</script>

{#if showModal}
	<dialog
		class:full={variant === 'full'}
		in:fade={{ duration: 200, easing: sineIn }}
		out:fade={{ duration: 200, easing: sineOut }}
		open
	>
		<h2>{@html title}</h2>
		{#if content}<p>{@html content}</p>{/if}
		{@render children()}
		<!-- <button class="btn" on:click={closeModal}>ok</button> -->
	</dialog>
	<div
		onkeydown={(e) => {
			console.log(e);
		}}
		tabindex="0"
		role="button"
		aria-label="close modal"
		class="modal-backdrop"
		onclick={closeModal}
	></div>
{/if}

<style>
	dialog {
        position: fixed;
		top: 20%;
		width: 80%;
		max-width: 375px;
		z-index: 2;
        padding: 1rem;
	}
	dialog.full {
		top: 10%;
	}
	h2 {
		display: flex;
		align-items: center;
        margin: 0;
	}
	p {
		font-size: 2rem;
	}
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 0;
		background: rgba(0, 0, 0, 0.1);
		height: 100%;
		width: 100%;
	}
</style>
