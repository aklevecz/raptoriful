<script>
    /** @type {{children: any}}*/
    let {children, ...restProps} = $props()
</script>
<h1 {...restProps}>{@render children()}</h1>
<style>
    h1 {
        height: 44px;
		color: white;
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
        margin-top: 0rem;
		margin-bottom: 0.5rem;
		border: 1px solid;
    }
</style>