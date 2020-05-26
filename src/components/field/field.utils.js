export const isEven = (row, col) =>
  row % 2 === 0 ? col % 2 === 0 : col % 2 !== 0;

export const isMine = ({ isMine }) => isMine;
export const isRevealed = ({ isRevealed }) => isRevealed;
export const isFlagged = ({ isFlagged }) => isFlagged;
export const getNeighboringMines = ({ neighboringMines }) => neighboringMines;
export const getGroupName = ({ groupName }) => groupName;
export const isIsland = (field) =>
  !isMine(field) && hasNoNeighboringMines(field);

export const reveal = (field) => ({ ...field, isRevealed: true });
export const toggleFlagged = (field) => ({
  ...field,
  isFlagged: !isFlagged(field),
});
export const placeMine = (field) => ({ ...field, isMine: true });
export const setGroupName = (field, name) => ({ ...field, groupName: name });
export const setNeighboringMines = (field, amount) => ({
  ...field,
  neighboringMines: amount,
});

export const hasNoNeighboringMines = (field) =>
  getNeighboringMines(field) === 0;
export const hasSameGroupName = (field, otherField) =>
  getGroupName(field) === getGroupName(otherField);

export const isVisited = ({ isVisited }) => isVisited;
export const setVisited = (field) => ({ ...field, isVisited: true });

export const getDefaultField = () => ({
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  neighboringMines: 0,
  groupName: null,
});

export const createRandomShortString = () =>
  Math.random().toString(36).substr(3, 5);

export const createFieldOp = (field) => (operation) => operation(field);
