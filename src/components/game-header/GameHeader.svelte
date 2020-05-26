<script>
  import Time from "../time/Time.svelte";

  export let isGameRunning;
  export let levels;
  export let selectedLevel;
</script>

<style>
  .header {
    background-color: rgb(168, 199, 224);
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 75px;
    overflow: hidden;
  }
  .time-container {
    flex-basis: 200px;
  }
  .level-container {
  }
</style>

<div class="header">
  <div class="level-container">
    <select bind:value={selectedLevel}>
      {#each levels as level}
        <option>{level.name}</option>
      {/each}
    </select>
  </div>
  <div class="time-container">
    <Time isRunning={isGameRunning} />
  </div>
  <div class="level-container">Controls</div>
</div>
