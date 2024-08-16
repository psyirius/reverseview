<script lang="ts">
  import Counter from './lib/Counter.svelte'
</script>

<main>
  <div class="card">
    <Counter />
  </div>
</main>

<style lang="scss">
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .card {
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
    }
</style>
