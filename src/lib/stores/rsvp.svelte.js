import api from '$lib/api';
import events from './events';

/**
 * @typedef {Object} State
 * @property {'rsvped' | 'not rsvped' | 'unrsvped' | 'failed' | null} status
 * @property {Array<{color?:string, event_name:string, phone_number?:string}>} rsvps
 */

/**
 * @typedef {Object.<string, State>} InitialState
 */

/** @type {InitialState} */
const initialState = {
	user: {
		status: null,
		// all of the users rsvps -- could be moved to the user store? -- or create two different rsvp stores
		rsvps: []
	},
	zeitgeist: {
		status: null,
		// all rsvps for the given event -- zeitgeist in this case
		rsvps: []
	},
	flowers: {
		status: null,
		rsvps: []
	},
	bao3: {
		status: null,
		rsvps: []
	}
};

// /** @type {InitialState} */
// const initialState2 = Object.entries(events).reduce((acc, [key, value]) => {
// 	acc[key] = {
// 		status: null,
// 		rsvps: []
// 	};
// 	return acc
// }, {})
export function createRsvp() {
	const rsvp = $state(initialState);
	let fetching = $state(false)

	// severly over simplified for zeitgeist
	/** @param {string} eventName */
	async function getRaptorRSVPs(eventName) {
		/** @type {{success:true, message:string, rsvps:Array<{phone_number:string, event_name:string}>}} */
		const r = await api.getRaptorRSVPs();
		if (r.message === 'Unauthorized') {
			return;
		}
		if (r.rsvps.find((rsvp) => rsvp.event_name === eventName)) {
			rsvp[eventName].status = 'rsvped';
		} else {
			// TO zeitgeist
			rsvp[eventName].status = 'not rsvped';
		}

		rsvp.user.rsvps = r.rsvps;
	}

	/** @param {string} eventName */
	async function getAllRsvps(eventName) {
		const r = await api.getAllRSVPs(eventName);
		if (r.success) {
			rsvp[eventName].rsvps = r.rsvps.filter(/** @param {*} r*/ (r) => r.event_name === eventName);
		}
	}

	return {
		get state() {
			return rsvp;
		},
		get fetching() {
			return fetching
		},
		/** @param {string} eventName */
		init: async (eventName) => {
			await getRaptorRSVPs(eventName);
		},
		getAllRsvps,
		/** @param {string} eventName */
		createRSVP: async (eventName) => {
			fetching = true
			const r = await api.createRSVP(eventName);
			if (r.success) {
				rsvp.zeitgeist.status = 'rsvped';
			} else {
				rsvp.zeitgeist.status = 'failed';
			}
			await getAllRsvps(eventName);
			await getRaptorRSVPs(eventName);
			fetching = false
		},
		/** @param {string} eventName */
		unRSVP: async (eventName) => {
			fetching = true
			const r = await api.unRSVP(eventName);
			if (r.success) {
				rsvp.zeitgeist.status = 'unrsvped';
			} else {
				rsvp.zeitgeist.status = 'failed';
			}
			await getAllRsvps(eventName);
			await getRaptorRSVPs(eventName);
			fetching = false
		}
	};
}

export default createRsvp();
