<script>
	import modelStorage from '$lib/idb';
	import generate from '$lib/stores/generate.svelte';
	import raptorSvelte from '$lib/stores/raptor.svelte';
	import { createThumbnail } from '$lib/utils';
	import { onMount } from 'svelte';
	import HeartIcon from '../icons/heart-icon.svelte';
	import Modal from '../modal.svelte';

	/** @type {{imgObject: Omit<GeneratedImgEntry, "base64Url">}}*/
	let { imgObject } = $props();

  let showModal = $state(false);

	let imgEl = $state();

	onMount(async () => {
		let imgEntry = await modelStorage.getGeneratedImg(imgObject.id);
		imgEl.src = imgEntry.base64Url;
	});

	async function onUpload() {
		try {
			// Fetch the image
			const response = await fetch(imgEl.src);
			const blob = await response.blob();

			// Create a new blob with explicit content type
			const imageBlob = new Blob([blob], { type: 'image/png' });
			const thumbnailBase64 = await createThumbnail(imageBlob);
			const formData = new FormData();
      formData.append('id', imgObject.id);
			formData.append('image', imageBlob, `${imgObject.id}.png`);
			// formData.append('thumbnailBlob', thumbnailBob, `${imgObject.id}_thumb.png`);
			formData.append('thumbnailBase64', thumbnailBase64);
			formData.append('prompt', imgObject.prompt);

			console.log('Upload sizes:', {
				original: imageBlob.size,
				// thumbnail: thumbnailBlob.size
			});

			// Debug log
			console.log('Upload content type:', imageBlob.type);

			const uploadResponse = await fetch('/upload', {
				method: 'POST',
				body: formData
			});

			if (!uploadResponse.ok) {
				const errorData = await uploadResponse.json();
				throw new Error(errorData.error || 'Upload failed');
			}

			const result = await uploadResponse.json();
			console.log('Upload successful:', result);
		} catch (error) {
			console.error('Upload error:', error);
			throw error; // Re-throw to handle in calling function
		}
	}

	async function onFavorite() {
		try {
			await raptorSvelte.selectFavoriteBao(imgObject.id);
			await onUpload();
			// Optional: Show success message
		} catch (error) {
			console.error('Favorite error:', error);
			// Handle error appropriately
		}
	}

  async function onToggleDeleteModal() {
    showModal = !showModal;
  }

	async function onDelete() {
		await modelStorage.delete('generatedImgs', imgObject.id);
		generate.refreshAllGeneratedImgs();
	}

  let isFavorite = $derived(raptorSvelte.state.favoriteBao === imgObject.id);
</script>

<div class:favorite={raptorSvelte.state.favoriteBao === imgObject.id} class="generated-img-item">
	<img bind:this={imgEl} alt="Generated" />
	<!-- <div>{imgObject.prompt}</div> -->
	<button class="btn_icon" onclick={onFavorite}><HeartIcon active={isFavorite}/></button>
	<button class="btn_icon" onclick={onToggleDeleteModal}><img style="width:24px;" src="/icons/trash-icon.svg" alt="Delete" /></button>
	<!-- <button class="btn" onclick={onUpload}>Upload</button> -->
   <Modal title="Delete image" bind:showModal={showModal}>
    <div style="margin:1rem 0;word-break:auto-phrase;">Are you sure you want to delete this image?</div>
    <button class="btn" onclick={onToggleDeleteModal}>Cancel</button>
    <button class="btn neg" onclick={onDelete}>Delete</button>
   </Modal>
</div>

<style>
	.generated-img-item {
		flex: 0 0 45%;
		word-break: break-all;
		box-sizing: border-box;
	}
	.favorite {
		background-color: #82c6c991;
	}
	img {
		width: 100%;
		height: auto;
    border-radius: 10px;
	}
</style>
