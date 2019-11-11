<script>
  import { fade } from "svelte/transition";

  export let neighbouringMines;
  export let isMine;
  export let isRevealed;
  export let isFlagged;
  export let isEven;
  export let revealFieldHandler;
  export let flagFieldHandler;

  isRevealed = true;

  $: content = isRevealed
    ? isMine
      ? "💩"
      : neighbouringMines !== 0
      ? neighbouringMines
      : ""
    : isFlagged
    ? "🚩"
    : "";

  const neighbouringMinesClass =
    neighbouringMines === 0
      ? ""
      : neighbouringMines === 1
      ? "low"
      : neighbouringMines === 2 || neighbouringMines === 3
      ? "medium"
      : "high";

  $: backgroundClass =
    isRevealed && !isMine ? "revealed" : isEven ? "even" : "";
</script>

<style>
  .field {
    flex: 1 0 auto;
    position: relative;
    cursor: pointer;
    font-size: 1.5rem;
    background-color: #92d47e;
  }
  .field .revealed {
    background-color: #e7eee4;
  }
  .field .even {
    background-color: #86c571;
  }
  .field:after {
    content: "";
    float: left;
    display: block;
    padding-bottom: 100%;
  }
  .field .content {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .field:hover {
    background-color: #b9f8a6;
  }
  .field .low {
    color: #349aee;
  }
  .field .medium {
    color: #dad732;
  }
  .field .high {
    color: #ff3c00;
  }
</style>

<div class="field">
  <div
    class="content {neighbouringMinesClass}
    {backgroundClass}"
    on:mousedown={revealFieldHandler}
    on:contextmenu={flagFieldHandler}>
    {#if isRevealed || isFlagged}
      <p transition:fade={{ duration: 100 }}>{content}</p>
    {/if}
  </div>
</div>
