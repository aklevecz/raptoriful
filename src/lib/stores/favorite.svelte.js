const createFavoriteStore = () => {
	/** @type {{favoriteBao:string}} */
	let favorites = $state({ favoriteBao: '' });

	return {
		get state() {
			return favorites;
		},
		init: () => {
			favorites = storage.getFavorites();
		},
		selectFavoriteBao: (/** @type {string} */ item) => {
			favorites.favoriteBao = item
		},
		add: (/** @type {string} */ item) => {
			storage.updateFavorites(item);
			favorites = [...favorites, item];
		},
		remove: (index) => {
			favorites = favorites.filter((_, i) => i !== index);
		},
		clear: () => {
			favorites = [];
		}
	};
};

export default createFavoriteStore();