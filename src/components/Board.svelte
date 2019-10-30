<script>
  import { onMount } from "svelte";
  import {
    initBoard,
    revealFieldAtPos,
    flagFieldAtPos,
    revealAllFields
  } from "./board.utils.js";
  import { LEFT_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON } from "./board.constants.js";

  import Field from "./Field.svelte";

  export let rows;
  export let columns;
  export let mines;
  export let isGameStarted;
  export let startGameHandler;
  export let endGameHandler;

  let board = initBoard(rows, columns, mines);

  // TODO: this
  let interactionAllowed = true;

  const revealFieldHandler = (row, column) => event => {
    if (!interactionAllowed) {
      return;
    }

    // Start game when user click first time
    if (!isGameStarted) {
      startGameHandler();
    }

    if (event.which === LEFT_MOUSE_BUTTON) {
      const { board: newBoard, isMineHit, isGameEnd } = revealFieldAtPos(
        board,
        row,
        column
      );
      board = newBoard;
      const didPlayerWin = isGameEnd && !isMineHit;

      if (isGameEnd) {
        interactionAllowed = false;
        endGameHandler(didPlayerWin);
        board = revealAllFields(board);
      }
    }
  };

  const flagFieldHandler = (row, column) => event => {
    event.preventDefault();
    if (!isGameStarted) {
      startGameHandler();
    }

    if (event.which === RIGHT_MOUSE_BUTTON) {
      board = flagFieldAtPos(board, row, column);
    }
  };

  const isEven = (row, col) => {
    return row % 2 === 0 ? col % 2 === 0 : col % 2 !== 0;
  };
</script>

<style>
  .board-grid {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    box-shadow: 5px 5px 10px #969696;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
    supported by Chrome, Opera and Firefox */
  }
  .board-grid-row {
    display: flex;
  }
</style>

interactionAllowed: {interactionAllowed}
<div class="board-grid">
  {#each board as row, i}
    <div class="board-grid-row">
      {#each row as { isMine, isFlagged, isRevealed, neighbouringMines }, j}
        <Field
          {isMine}
          {isFlagged}
          {isRevealed}
          {neighbouringMines}
          revealFieldHandler={interactionAllowed && revealFieldHandler(i, j)}
          flagFieldHandler={interactionAllowed && flagFieldHandler(i, j)}
          isEven={!isEven(i, j)} />
      {/each}
    </div>
  {/each}
</div>
