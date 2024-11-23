import api from '$lib/api';

/** @typedef {Object} State
 * @property {string} color
 * @property {string} favoriteBao
 * @property {Array<string>} favoriteBaos
 * @property {string} mainBao
 */

/** @type {State} */
const initialState = {
	color: '#fff',
	favoriteBao: "",
	favoriteBaos: [],
	mainBao: ""
};
export function createRaptor() {
	const raptor = $state(initialState);

	return {
		get state() {
			return raptor;
		},
		init: async () => {
			const r = await api.getRaptor();
			console.log(`raptor init:`, r)
			if (r.success) {
				raptor.color = `#${r.raptor.color}`;
				if (r.favorite) {
					raptor.favoriteBao = r.favorite;
					raptor.mainBao = r.favorite
					// favoriteSvelte.selectFavoriteBao(r.favorite);
				}
				if (r.favorites) {
					raptor.favoriteBaos = r.favorites;
				}
			}
		},
		selectFavoriteBao: (/** @type {string} */ item) => {
			raptor.favoriteBaos = [...raptor.favoriteBaos.filter(i => i !== item), item]
		},
		removeFavoriteBao: (/** @type {string} */ item) => {
			raptor.favoriteBaos = raptor.favoriteBaos.filter(i => i !== item)
		},
		selectMainBao: (/** @type {string} */ item) => {
			console.log(`selectMainBao: ${item}`)
			raptor.mainBao = item
		}
	};
}

export default createRaptor();
