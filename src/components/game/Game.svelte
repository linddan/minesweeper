<script>
  import { onMount } from "svelte";
  import { createMachine, interpret } from "@xstate/fsm";
  import { state, event, stateMachineConfig } from "./state-machine-config";
  import { levels } from "./game.constants";

  import GameHeader from "../game-header/GameHeader.svelte";
  import Board from "../board/Board.svelte";

  const gameService = interpret(createMachine(stateMachineConfig));

  let gameState = null;
  let selectedLevel = levels[0];

  /*
   * Handlers
   */
  const onClickBoard = () => {
    // Start the game once player makes a move
    if (gameState === state.START) {
      gameService.send(event.START_PLAYING);
    }
  };

  const onGameStateChanged = state => {
    gameState = state.value;
    console.log(`gameState changed to ${state.value}`);
  };
  const onStart = () => {
    console.log("onStart called");
    gameService.send(event.START_PLAYING);
  };
  const onPause = () => {
    console.log("onPause called");
    gameService.send(event.PAUSE);
  };
  const onWon = () => {
    console.log("onWon called");
    gameService.send(event.WON);
  };
  const onLost = () => {
    console.log("onLost called");
    gameService.send(event.LOST);
  };

  onMount(() => {
    gameService.subscribe(onGameStateChanged);
    gameService.start();

    return () => {
      gameService.stop();
    };
  });
</script>

<style>
  .game {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>

<div class="game">
  <GameHeader
    isGameRunning={gameState === state.PLAYING}
    {levels}
    {selectedLevel} />
  <Board
    rows={selectedLevel.rows}
    columns={selectedLevel.columns}
    mines={selectedLevel.mines}
    on:boardClicked={onClickBoard}
    on:pooHit={onLost}
    on:boardSweeped={onWon} />
</div>
