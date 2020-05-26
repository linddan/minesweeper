<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    createBoard,
    createBoardInitializer,
    revealField,
    flagFieldAtPos,
    revealAllFields,
    isGameWon,
    isGameLost
  } from "./board.utils.js";
  import { LEFT_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON } from "./board.constants.js";
  import { convertTo1DPos, to2DArray } from "../../utils/array.utils";
  import { isEven } from "../field/field.utils";
  import Field from "../field/Field.svelte";

  export let rows;
  export let columns;
  export let mines;

  const setupBoard = (rows, columns, mines) => {
    const defaultBoard = createBoard(rows, columns);
    const initializeBoard = createBoardInitializer(mines);
    return initializeBoard(defaultBoard);
  };

  const dispatch = createEventDispatcher();
  let board = setupBoard(rows, columns, mines);

  console.log({ board });

  const checkBoardStatus = () => {
    if (isGameLost(board)) {
      dispatch("pooHit");
    } else if (isGameWon(board)) {
      dispatch("boardSweeped");
      board = revealAllFields(board);
    }
  };

  const onClickField = (row, column) => event => {
    dispatch("boardClicked");
    switch (event.which) {
      case LEFT_MOUSE_BUTTON:
        board = revealField(board, [row, column]);
        console.log({ board });
        break;
      case RIGHT_MOUSE_BUTTON:
        event.preventDefault();
        board = flagFieldAtPos(board, [row, column]);
        break;
      default:
        return;
    }
    checkBoardStatus();
  };

  onMount(() => {});
</script>

<style>
  .board-grid {
    margin: 0 auto;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  .board-grid-row {
    display: flex;
  }
</style>

<div class="board-grid">
  {#each board as row, i}
    <div class="board-grid-row">
      {#each row as { isMine, isFlagged, isRevealed, neighboringMines, groupName }, j}
        <Field
          {isMine}
          {isFlagged}
          {isRevealed}
          {neighboringMines}
          {groupName}
          isEven={isEven(i, j)}
          onClick={onClickField(i, j)} />
      {/each}
    </div>
  {/each}
</div>
