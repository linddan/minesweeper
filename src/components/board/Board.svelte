<script>
  import { onMount } from "svelte";
  import {
    createBoard,
    createBoardInitializer,
    revealFieldAtPos,
    flagField,
    revealAllFields,
    isGameWon,
    isGameLost
  } from "./board.util.js";
  import { convertTo1DPos, to2DArray } from "../../utils/array.utils";
  import { LEFT_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON } from "./board.constants.js";
  import Field from "../field/Field.svelte";

  // Props
  export let rows;
  export let columns;
  export let mines;
  export let isGameStarted;
  export let startGameHandler;
  export let endGameHandler;

  // Local state
  let interactionAllowed = true;
  $: board = createBoard(rows * columns);
  $: board2D = to2DArray(board, columns);

  // Lifecycle
  onMount(() => {
    const initBoard = createBoardInitializer(mines);
    board = initBoard(board);
    console.log(board);
  });

  // Other
  const revealFieldHandler = (row, column) => event => {
    if (!interactionAllowed) {
      return;
    }
    // Start game when user click first time
    if (!isGameStarted) {
      startGameHandler();
    }
    const boardPosition = convertTo1DPos(row, column, columns);
    if (event.which === LEFT_MOUSE_BUTTON) {
      board = revealFieldAtPos(board, boardPosition);
      const playerWon = isGameWon(board);
      const playerLost = isGameLost(board);
      const gameEnded = playerWon || playerLost;

      if (gameEnded) {
        board = revealAllFields(board);
        endGameHandler(playerWon);
      }
    }
  };

  const flagFieldHandler = (row, column) => event => {
    event.preventDefault();
    if (!isGameStarted) {
      startGameHandler();
    }

    if (event.which === RIGHT_MOUSE_BUTTON) {
      createBoardUpdater(board);
      board = flagField(board, row * column);
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

<div class="board-grid">
  {#each board2D as row, i}
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
