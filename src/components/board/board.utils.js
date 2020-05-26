import {
  neighborPositionOffsets,
  getNeighborPositionOffsets,
} from "./board.constants";
import { compose, pipe } from "../../utils/fn.utils";
import {
  to2DArray,
  map2d,
  getDimensions2D,
  getRandomPositions2D,
  for2D,
} from "../../utils/array.utils";
import {
  isMine,
  isRevealed,
  isFlagged,
  isVisited,
  isIsland,
  getNeighboringMines,
  getGroupName,
  reveal,
  toggleFlagged,
  placeMine,
  setGroupName,
  setNeighboringMines,
  hasNoNeighboringMines,
  hasSameGroupName,
  createRandomShortString,
  setVisited,
} from "../field/field.utils";

//
// Board functions
//

// getfield. row, column
// getBoard(board)
// createBoardOp -> fn -> revel(field)

const createGetFieldAtPos = (board) => ([row, col]) =>
  board[row] && board[row][col] ? { ...board[row][col] } : null;

const getField = (board, row, col) =>
  board[row] && board[row][col] ? { ...board[row][col] } : null;

const createBoardOp = (board) => (row, col, fieldOp) =>
  map2d(board, (field, r, c) =>
    r === row && c === col ? fieldOp(field) : { ...field }
  );

// TODO: Add the array helper functions to board prototype
export const createBoard = (
  rows,
  columns,
  defaultField = {
    isMine: false,
    isRevealed: false,
    isFlagged: false,
    neighboringMines: 0,
    groupName: null,
  }
) => new Array(rows).fill(new Array(columns).fill({ ...defaultField }));

// const cloneBoard = (board) => map2d(board, (field) => ({ ...field }));

const isBoardPositionEqual = (row1, col1, row2, col2) =>
  row1 === row2 && col1 === col2;

export const revealAllFields = (board) => map2d(board, reveal);

export const flagFieldAtPos = (board, [row, col]) =>
  createBoardOp(board)(row, col, toggleFlagged);

export const placeMineAtPos = (board, row, col) =>
  createBoardOp(board)(row, col, placeMine);

// Returns a function to initialize the board with mines, neighbor information, etc.
export const createBoardInitializer = (noOfMines) => {
  const placeMines = createMinePlacer(noOfMines);
  return compose(calculateIslands, calculateNeighboringMines, placeMines);
};

const createMinePlacer = (noOfMines) => (board) => {
  const [rows, columns] = getDimensions2D(board);
  const minePositions = getRandomPositions2D(noOfMines, rows, columns);
  return map2d(board, (field, row, col) =>
    !!minePositions.find(({ x: mineRow, y: mineCol }) =>
      isBoardPositionEqual(mineRow, mineCol, row, col)
    )
      ? placeMine(field)
      : { ...field }
  );
};

// Field is considered 'good' when revealed or flagged correctly
const isFieldGood = (field) =>
  isMine(field) ? !isRevealed(field) : isRevealed(field);

// Field is considered 'bad' when falsely revealed
const isFieldBad = (field) => (isMine(field) ? isRevealed(field) : false);

export const isGameWon = (board) => board.flat().every(isFieldGood);
export const isGameLost = (board) => board.flat().some(isFieldBad);

export const revealField = (board, pos) => {
  const getFieldAtPos = createGetFieldAtPos(board);
  const revealedField = getFieldAtPos([row, col]);
  return map2d(board, (field, r, c) => {
    const shouldRevealField =
      isBoardPositionEqual({ row, col }, { r, c }) ||
      (hasNoNeighboringMines(revealedField) &&
        hasSameGroupName(field, revealedField));

    return shouldRevealField ? reveal(field) : { ...field };
  });
};

const calculateNeighboringMines = (board) => {
  const getFieldAtPos = createGetFieldAtPos(board);
  map2d(board, (field, row, column) => {
    const amount = neighborPositionOffsets.reduce(
      (noOfMines, [rowOffset, columnOffset]) => {
        const field = getFieldAtPos([row + rowOffset, column + columnOffset]);
        noOfMines += field && isMine(field) ? 1 : 0;
        return noOfMines;
      },
      0
    );
    return setNeighboringMines(field, amount);
  });
};

// TODO: This mutates original board
const traverseNeighboringFields = (
  board,
  row,
  column,
  groupName,
  traversalMap
) => {
  traversalMap[row][column].isVisited = true;

  // TODO: Pass neighbor positions
  neighborPositionOffsets.map(([rowOffset, columnOffset]) => {
    const neighborRow = row + rowOffset;
    const neighborColumn = column + columnOffset;
    const neighborField = getField(board, neighborRow, neighborColumn);
    const isNeighborPartOfIsland =
      neighborField &&
      !traversalMap[neighborRow][neighborColumn].isVisited &&
      neighborField.neighboringMines === 0;
    if (isNeighborPartOfIsland) {
      traversalMap[neighborRow][neighborColumn].groupName = groupName;
      traversalMap = traverseNeighboringFields(
        board,
        neighborRow,
        neighborColumn,
        groupName,
        traversalMap
      );
    }
  });
  return traversalMap;
};

export const calculateIslands = (board) => {
  // Make a copy of our board to traverse
  let traversalMap = map2d(board, (field) => ({
    isVisited: false,
    groupName: null,
    ...field,
  }));

  console.log({ traversalMap });
  // Should be a forEach here
  map2d(traversalMap, (traversalField, row, column) => {
    if (isIsland(traversalField) && !isVisited(traversalField)) {
      newTraversalField = setVisited(traversalField);
      setGroupName(traversalField, createRandomShortString());
      console.log({ groupName: traversalField.groupName });
      traversalMap = traverseNeighboringFields(
        board,
        row,
        column,
        traversalField.groupName,
        traversalMap
      );
    } else {
      setVisited(traversalField);
    }
  });

  debugger;

  return map2d(board, (field, row, column) => ({
    ...field,
    groupName: traversalMap[row][column].groupName,
  }));
};
