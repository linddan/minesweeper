export const isMine = ({ isMine }) => isMine;
export const isRevealed = ({ isRevealed }) => isRevealed;
export const isFlagged = ({ isFlagged }) => isFlagged;
export const getNeighbouringMines = ({ neighbouringMines }) => neighbouringMines;
export const getGroupName = ({ groupName }) => groupName;

export const reveal = (field) => ({ ...field, isRevealed: true });
export const toggleFlagged = (field) => ({ ...field, isFlagged: !isFlagged(field) });;
export const placeMine = (field) => ({ isMine: true });
export const setGroupName = (field, name) => ({ ...field, groupName: name });
export const setNeighbouringMines = (field, amount) => ({ ...field, neighbouringMines: amount });