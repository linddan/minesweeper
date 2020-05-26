export const state = {
  START: "start",
  PLAYING: "playing",
  PAUSED: "paused",
  LOST: "lost",
  WON: "won",
};

export const event = {
  START_PLAYING: "START_PLAYING",
  PAUSE: "PAUSE",
  LOST: "LOST",
  WON: "WON",
  RESTART: "RESTART",
};

export const stateMachineConfig = {
  id: "game-state-machine",
  initial: state.START,
  states: {
    [state.START]: {
      on: { [event.START_PLAYING]: [state.PLAYING] },
    },
    [state.PLAYING]: {
      on: {
        [event.LOST]: [state.LOST],
        [event.WON]: [state.WON],
        [event.PAUSE]: [state.PAUSED],
      },
    },
    [state.PAUSED]: {
      on: { [event.START_PLAYING]: [state.PLAYING] },
    },
    [state.LOST]: {
      on: { [event.RESTART]: [state.START] },
    },
    [state.WON]: {
      on: { [event.RESTART]: [state.START] },
    },
  },
};
