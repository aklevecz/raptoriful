import modelStorage from '$lib/idb';
import generateSvelte from './generate.svelte';
import raptorSvelte from './raptor.svelte';

export default {
	initUsersAndGenerations: () => {
		const promises = [];
		promises.push(raptorSvelte.init());
		promises.push(modelStorage.init());
		Promise.all(promises).then(() => {
			generateSvelte.init();
		});
	}
};
