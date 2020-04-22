export const isMine = ({ isMine }) => isMine;
export const isRevealed = ({ isRevealed }) => isRevealed;
export const isFlagged = ({ isFlagged }) => isFlagged;
export const getNeighbouringMines = ({ neighbouringMines }) => neighbouringMines;
export const getGroupName = ({ groupName }) => groupName;

export const reveal = (field) => ({ ...field, isRevealed: true });
export const toggleFlagged = (field) => ({ ...field, isFlagged: !isFlagged(field) });;
export const placeMine = (field) => ({ ...field, isMine: true });
export const setGroupName = (field, name) => ({ ...field, groupName: name });
export const setNeighbouringMines = (field, amount) => ({ ...field, neighbouringMines: amount });

export const hasNoNeighbouringMines = (field) => getNeighbouringMines(field) === 0;
export const hasSameGroupName = (field, otherField) => getGroupName(field) === getGroupName(otherField);

export const getDefaultField = () => ({
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighbouringMines: 0,
    groupName: null,
});
