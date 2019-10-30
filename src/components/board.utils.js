import {
  map2D,
  getRandomPositions2D,
  getDimensions2D,
  getFieldAtPos,
} from "../utils/array.utils";

import { neighbourPositionOffsets } from "./board.constants";

// TODO: More than 2 arguments -> options object

const defaultFieldConfig = {
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  neighbouringMines: 0,
  groupName: null,
}


// Field functions

const isMine = (field) => field.isMine;
const isRevealed = (field) => field.isRevealed;
const isFlagged = (field) => field.isFlagged;
const neighbouringMines = (field) => field.neighbouringMines;
const groupName = (field) => field.groupName;

const reveal = (field) => ({ ...field, isRevealed: true });
const placeMine = (field) => ({ ...field, isMine: true });
const toggleFlagged = (field) => ({ ...field, isFlagged: !isFlagged(field) });;
const setGroupName = (field, name) => ({ ...field, groupName: name });
const setNeighbouringMines = (field, amount) => ({ ...field, neighbouringMines: amount });

//
// Board functions
//

const updateFieldAtPos = (board, field, row, column) => {
  const newBoard = cloneBoard(board);
  newBoard[row][column] = { ...field };
  return newBoard;
}

export const revealAllFields = (board) => map2D(board, reveal);

const cloneBoard = board => map2D(board, field => ({ ...field }));

export const initBoard = (rows, columns, mines) =>
  calculateIslands(
    calculateNeighbouringMines(
      spreadMines(
        createBoard(rows, columns, defaultFieldConfig),
        mines
      )
    )
  );

const createBoard = (rows, columns, defaultField) => {
  let board = [];
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push({ ...defaultField });
    }
    board.push([...row]);
  }
  return board;
}

const spreadMines = (board, amount) => {
  const [rows, columns] = getDimensions2D(board);
  const minePositions = getRandomPositions2D(amount, rows, columns);
  return map2D(board, (field, row, col) =>
    minePositions.some(([mineRow, mineCol]) => row === mineRow && col === mineCol)
      ? placeMine(field)
      : field
  );
};

const isMineAtPos = (board, row, column) =>
  isPosValid(board, row, column) && board[row][column].isMine

export const flagFieldAtPos = (board, row, column) =>
  updateFieldAtPos(
    board,
    toggleFlagged(getFieldAtPos(board, row, column)),
    row,
    column
  );

// TODO: Create a board-map function
const calculateNeighbouringMines = (board) => {
  const newBoard = cloneBoard(board);
  map2D(newBoard, (_, row, column) => {
    newBoard[row][column].neighbouringMines =
      neighbourPositionOffsets.reduce((noOfMines, [rowOffset, columnOffset]) => {
        const field = getFieldAtPos(board, row + rowOffset, column + columnOffset);
        noOfMines += field && field.isMine ? 1 : 0;
        return noOfMines
      }, 0);
  });
  return newBoard;
};

// TODO: This mutates original board
const traverseNeighbouringFields = (board, row, column, groupName, traversalMap) => {
  traversalMap[row][column].visited = true;

  // TODO: Pass neighbour positions
  neighbourPositionOffsets.map(([rowOffset, columnOffset]) => {
    const neighbourRow = row + rowOffset
    const neighbourColumn = column + columnOffset;
    const neighbourField = getFieldAtPos(board, neighbourRow, neighbourColumn);
    const isNeighbourPartOfIsland =
      neighbourField
      && !traversalMap[neighbourRow][neighbourColumn].visited
      && neighbourField.neighbouringMines === 0;
    if (isNeighbourPartOfIsland) {
      traversalMap[neighbourRow][neighbourColumn].groupName = groupName;
      traversalMap = traverseNeighbouringFields(board, neighbourRow, neighbourColumn, groupName, traversalMap);
    }
  });
  return traversalMap;
}

export const calculateIslands = (board) => {
  const newBoard = cloneBoard(board);
  const [rows, columns] = getDimensions2D(newBoard);
  let traversalMap = createBoard(rows, columns, { visited: false, groupName: null })

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const field = getFieldAtPos(newBoard, row, column);
      const isZeroIsland = field && !field.isMine && field.neighbouringMines === 0;

      if (isZeroIsland && !traversalMap[row][column].visited) {
        const groupName = Math.random().toString(36).substr(2, 5);
        traversalMap[row][column].groupName = groupName;
        traversalMap[row][column].visited = true;
        traversalMap = traverseNeighbouringFields(newBoard, row, column, groupName, traversalMap);
      } else {
        traversalMap[row][column].visited = true;
      }
    }
  }
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {

      if (traversalMap[row][column].groupName) {
        newBoard[row][column].groupName = traversalMap[row][column].groupName
      }
    }
  }
  return newBoard;
};

const isGameWon = (board) =>
  board.flat().every((field) =>
    field.isMine
      ? !field.isRevealed
      : field.isRevealed
  );

// TODO: Don't overwrite variables
export const revealFieldAtPos = (board, row, column) => {
  const newBoard = cloneBoard(board);
  const [rows, columns] = getDimensions2D(newBoard);
  newBoard[row][column].isRevealed = true;
  const field = getFieldAtPos(newBoard, row, column);

  if (field.isMine) {
    console.log('YOU LOST')
    return { board: newBoard, isMineHit: true, isGameEnd: true };
  } else if (isGameWon(newBoard)) {

    console.log('YOU WON')
  }
  else if (field.neighbouringMines === 0) {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        if (newBoard[row][column].groupName === field.groupName) {
          newBoard[row][column].isRevealed = true;
        }
      }
    }
  }
  return { board: newBoard, isMineHit: false, isGameEnd: false };
};

