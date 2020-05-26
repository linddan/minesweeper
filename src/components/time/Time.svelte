<script>
  import { onDestroy, afterUpdate } from "svelte";

  // Props
  export let isRunning;

  let time = 0;
  let timerId = null;

  const startTimer = () => setInterval(() => (time += isRunning ? 1 : 0), 1000);

  afterUpdate(() => {
    const shouldStartTimer = !isRunning && !timerId;

    if (shouldStartTimer) {
      timerId = startTimer();
    }
  });

  onDestroy(() => {
    if (timerId) {
      clearInterval(timerId);
    }
  });
</script>

<style>
  .clock {
    font-size: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="clock">
  <p>{time}</p>
</div>
