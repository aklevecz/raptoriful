import api from '$lib/api';
import favoriteSvelte from './favorite.svelte';

const initialState = {
	color: '#fff',
	favoriteBao: ""
};
export function createRaptor() {
	const raptor = $state(initialState);

	return {
		get state() {
			return raptor;
		},
		init: async () => {
			const r = await api.getRaptor();
			if (r.success) {
				raptor.color = `#${r.raptor.color}`;
				if (r.favorite) {
					raptor.favoriteBao = r.favorite;
					// favoriteSvelte.selectFavoriteBao(r.favorite);
				}
			}
		},
		selectFavoriteBao: (/** @type {string} */ item) => {
			raptor.favoriteBao = item
		}
	};
}

export default createRaptor();
