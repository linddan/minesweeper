<script>
  import { fade } from "svelte/transition";
  import { beforeUpdate } from "svelte";
  import { BOMB_EMOJI, FLAG_EMOJI } from "./field.constants.js";

  export let neighboringMines;
  export let isMine;
  export let isRevealed;
  export let isFlagged;
  export let isEven;
  export let onClick;
  export let groupName;

  isRevealed = true;

  $: content = isRevealed
    ? isMine
      ? BOMB_EMOJI
      : neighboringMines !== 0
      ? neighboringMines
      : ""
    : isFlagged
    ? FLAG_EMOJI
    : "";

  const neighboringMinesClass =
    neighboringMines === 0
      ? ""
      : neighboringMines === 1
      ? "low"
      : neighboringMines === 2 || neighboringMines === 3
      ? "medium"
      : "high";

  $: backgroundClass =
    isRevealed && !isMine ? "revealed" : isEven ? "even" : "";

  beforeUpdate(() => {
    // console.log({ isRevealed });
  });
</script>

<style>
  .field {
    flex: 1 0 auto;
    position: relative;
    cursor: pointer;
    font-size: 1.5rem;
    background-color: #5da347;
  }
  .field:hover {
    background-color: #b9f8a6;
  }
  .field .revealed {
    background-color: #e7eee4;
  }
  .field .even {
    background-color: #86c571;
  }
  .field .even:hover {
    background-color: #b9f8a6;
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
    class="content {neighboringMinesClass}
    {backgroundClass}"
    on:mousedown={onClick}
    on:contextmenu={onClick}>
    {#if isRevealed || isFlagged}
      <p transition:fade={{ duration: 100 }}>{groupName}</p>
    {/if}
  </div>
</div>
