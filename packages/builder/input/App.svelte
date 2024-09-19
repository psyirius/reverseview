<script>
    // import "core-js/modules/es.set.js";
    // import "core-js/modules/es.map.js";
    // import "core-js/modules/es.symbol.js";
    // import "core-js/modules/web.queue-microtask.js";
    import Box from "./Box.svelte";

    let count = $state(0);

    function increment() {
        count += 1;
    }
</script>

<button onclick={increment}>
    clicks: {count}
    <Box name="boomex" />
</button>

<style lang="scss">
    button {
        color: black;

        &:hover {
            color: red;
        }
    }
</style>