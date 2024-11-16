<script>
	import { formatDate } from '$lib/utils';

	/** @type {*} event */
	let { event } = $props();
</script>

<div class="header_wrapper">
	<h1 style="text-transform:capitalize;">{event.name}</h1>
	<h3 style="text-align:center;">{event.location}</h3>
</div>
<div class="date_wrapper"><h3>{formatDate(new Date(event.date))}</h3></div>

<style>
	.header_wrapper {
		display: flex;
		gap: 1rem;
		border: 1px solid var(--primary-color);
		padding: 0.25rem 0.3rem;
        padding: .5rem;
        padding-left: .75rem
	}
    .date_wrapper {
        border: 1px solid var(--primary-color);
        border-top:0;
        padding: .5rem;
        padding-left: .75rem
    }
    h1, h3 {
        margin: 0;
    }
</style>
