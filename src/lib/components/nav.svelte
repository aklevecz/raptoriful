<script>
	import Claw from './claw.svelte';
	import Raptor from './raptor.svelte';
</script>

<ul>
	<li>
		<a href="/"><Claw /></a>
	</li>
	<li>
		<a href="/profile"><Raptor accent={'black'} size={40} /></a>
	</li>
</ul>

<style>
	ul {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		list-style: none;
		padding: 0;
		position: fixed;
		bottom: -16px;
		right: 0;
		gap: 1rem;
		width: 60px;
		align-items: center;
		padding: 0.5rem;
	}
	a {
		font-size: 30px;
		text-decoration: none;
		color: var(--primary-color);
		display: flex;
		height: 50px;
		background: white;
		width: 50px;
		align-items: center;
		justify-content: center;
	}
	a:hover {
	}
	li {
		margin: 0;
		padding: 0;
	}
</style>
