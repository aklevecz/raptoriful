import events from '$lib/stores/events';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
    return {event: events.bao3};
}