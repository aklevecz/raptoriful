<script>
	import modelStorage from '$lib/idb';
	import generate from '$lib/stores/generate.svelte';
	import raptorSvelte from '$lib/stores/raptor.svelte';
	import { createThumbnail } from '$lib/utils';
	import { onMount } from 'svelte';
	import HeartIcon from '../icons/heart-icon.svelte';
	import Modal from '../modal.svelte';
	import StarIcon from '../icons/star-icon.svelte';

	/** @type {{imgObject: Omit<GeneratedImgEntry, "base64Url">}}*/
	let { imgObject } = $props();

	let showModal = $state(false);
  let showImgPreviewModal = $state(false);

	let imgEl = $state();
  let imgPreviewEl = $state();

	onMount(async () => {
		let imgEntry = await modelStorage.getGeneratedImg(imgObject.id);
		imgEl.src = imgEntry.base64Url;
	});

  $effect(() => {
    if (showImgPreviewModal) {
      imgPreviewEl.src = imgEl.src
    }
  })

	let isMain = $derived(raptorSvelte.state.mainBao === imgObject.id);
	let isFavorite = $derived(raptorSvelte.state.favoriteBaos.includes(imgObject.id));

	async function onUpload(action = 'save-favorite') {
		try {
			if (action === 'remove-favorite') {
				const removeResponse = await fetch('/favorites', {
					method: 'DELETE',
					body: JSON.stringify({ id: imgObject.id })
				});
				if (!removeResponse.ok) {
					const errorData = await removeResponse.json();
					throw new Error(errorData.error || 'Remove favorite failed');
				}
				const result = await removeResponse.json();
				console.log('Remove favorite successful:', result);
				return;
			}

			// Fetch the image
			const response = await fetch(imgEl.src);
			const blob = await response.blob();
			const formData = new FormData();

			// Create a new blob with explicit content type
			// const imageBlob = new Blob([blob], { type: 'image/png' });
			// formData.append('image', imageBlob, `${imgObject.id}.png`);

			const imageBlob = new Blob([blob], { type: 'image/jpeg' });
			formData.append('image', imageBlob, `${imgObject.id}.jpg`);
			const thumbnailBase64 = await createThumbnail(imageBlob);
			formData.append('id', imgObject.id);
			formData.append('action', action);
			formData.append('thumbnailBase64', thumbnailBase64);
			formData.append('prompt', imgObject.prompt);

			console.log('Upload sizes:', {
				original: imageBlob.size
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
			if (!isFavorite) {
				await raptorSvelte.selectFavoriteBao(imgObject.id);
				await onUpload('save-favorites');
			} else {
				await raptorSvelte.removeFavoriteBao(imgObject.id);
				await onUpload('remove-favorite');
			}
			// Optional: Show success message
		} catch (error) {
			console.error('Favorite error:', error);
			// Handle error appropriately
		}
	}

	async function onMained() {
		try {
			await raptorSvelte.selectMainBao(imgObject.id);
			await onUpload('save-main');
			// Optional: Show success message
		} catch (error) {
			console.error('Favorite error:', error);
			// Handle error appropriately
		}
	}

	async function onToggleShowModal() {
		showModal = !showModal;
	}

	async function onDelete() {
		await modelStorage.delete('generatedImgs', imgObject.id);
		generate.refreshAllGeneratedImgs();
	}


</script>

<div class:favorite={isMain} class="generated-img-item">
	<img onclick={() => showImgPreviewModal = true} bind:this={imgEl} alt="Generated" />
	<!-- <div>{imgObject.prompt}</div> -->
	<button class="btn_icon" onclick={onFavorite}><HeartIcon active={isFavorite} /></button>
	<button class="btn_icon" onclick={onMained}><StarIcon active={isMain} /></button>
	<button class="btn_icon" onclick={onToggleShowModal}
		><img style="width:24px;" src="/icons/trash-icon.svg" alt="Delete" /></button
	>
	<!-- <button class="btn" onclick={onUpload}>Upload</button> -->
	<Modal title="Delete image" bind:showModal>
		<div style="margin:1rem 0;word-break:auto-phrase;">
			Are you sure you want to delete this image?
		</div>
		<button class="btn" onclick={onToggleShowModal}>Cancel</button>
		<button class="btn neg" onclick={onDelete}>Delete</button>
	</Modal>

  <Modal title="Bao" bind:showModal={showImgPreviewModal}>
    <div style="margin:1rem 0;word-break:auto-phrase;">
      <img bind:this={imgPreviewEl} alt="Generated" />
      <button class="btn" onclick={() => showImgPreviewModal = false}>Close</button>
    </div>
  </Modal>
</div>

<style>
	.generated-img-item {
		flex: 0 0 45%;
		word-break: break-all;
		box-sizing: border-box;
    transition: filter 0.5s ease-in-out;
	}
	.favorite {
		/* background-color: #82c6c991; */
		filter: brightness(1.25);
	}
	img {
		width: 100%;
		height: auto;
		border-radius: 10px;
	}
</style>
