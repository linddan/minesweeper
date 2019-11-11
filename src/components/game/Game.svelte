<script>
  import GameInfo from "../game-header/GameHeader.svelte";
  import Board from "../board/Board.svelte";
  import {
    GAME_NOT_STARTED,
    GAME_STARTED,
    GAME_WON,
    GAME_LOST
  } from "./Game.constants.js";

  let gameState = GAME_NOT_STARTED;

  $: isGameStarted = gameState === GAME_STARTED;

  const startGameHandler = () => {
    gameState = GAME_STARTED;
    console.log("gameStartHandler", gameState);
  };
  const endGameHandler = isWin => {
    gameState = isWin ? GAME_WON : GAME_LOST;
    console.log("gameOverHandler", gameState);
  };
</script>

<style>
  .game {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>

<div class="game">
  <p>isGameStarted: {isGameStarted}</p>
  <p>gameState: {gameState}</p>
  <GameInfo {isGameStarted} />
  <Board
    rows={8}
    columns={8}
    mines={2}
    {isGameStarted}
    {startGameHandler}
    {endGameHandler} />
</div>
