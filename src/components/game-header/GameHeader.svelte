<script>
  import Time from "../time/Time.svelte";

  // Props
  export let isGameStarted;
</script>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 150px;
  }
  .level {
    background-color: darkolivegreen;
    text-align: center;
    color: white;
  }
</style>

<div class="header">
  <div class="level">Level</div>
  <Time isRunning={isGameStarted} />
  <div class="level">Controls</div>
</div>
