import { neighbourPositionOffsets, getNeighbourPositionOffsets } from "./board.constants";
import { compose, pipe } from "../../utils/fn.utils";
import { getRandomPositions, to2DArray, map2D, getDimensions2D, getRandomPositions2D } from "../../utils/array.utils";
import {
    isMine,
    isRevealed,
    isFlagged,
    getNeighbouringMines,
    getGroupName,
    reveal,
    toggleFlagged,
    placeMine,
    setGroupName,
    setNeighbouringMines,
    hasNoNeighbouringMines,
    hasSameGroupName,
} from '../field/field.util';

const createBoardUpdater = (board) => (row, col, fieldOp) =>
    map2D(board, (field, r, c) =>
        (r === row && c === col)
            ? fieldOp(field)
            : { ...field });

//
// Board functions
//
const getField = (board, row, col) =>
    board[row] && board[row][col]
        ? { ...board[row][col] }
        : null;

export const createBoard = (
    rows,
    cols,
    defaultField = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighbouringMines: 0,
        groupName: null,
    }) => new Array(rows).fill(new Array(cols).fill({ ...defaultField }));

const cloneBoard = board => map2D(board, field => ({ ...field }));

const isSameBoardPosition = (row1, col1, row2, col2) =>
    row1 === row2 && col1 === col2

export const revealAllFields = (board) => map2D(board, reveal);

export const flagFieldAtPos = (board, row, col) =>
    createBoardUpdater(board)(row, col, toggleFlagged)

export const placeMineAtPos = (board, row, col) =>
    createBoardUpdater(board)(row, col, placeMine)

export const createBoardInitializer = (noOfMines) =>
    compose(
        calculateIslands,
        calculateNeighbouringMines,
        createMinePlacer(noOfMines),
    )

const createMinePlacer = noOfMines => board => {
    const { rows, cols } = getDimensions2D(board);
    const minePositions = getRandomPositions2D(noOfMines, rows, cols);
    return map2D(board, (field, row, col) =>
        !!minePositions.find(({ x: mineRow, y: mineCol }) =>
            isSameBoardPosition(mineRow, mineCol, row, col))
            ? placeMine(field)
            : { ...field }
    );
};

export const isGameWon = (board) =>
    board.flat().every((field) =>
        isMine(field)
            ? !isRevealed(field)
            : isRevealed(field)
    );

export const isGameLost = (board) =>
    board.flat().some((field) =>
        isMine(field)
            ? isRevealed(field)
            : false
    );

export const revealField = (board, row, col) => {
    const revealedField = getField(board, row, col);
    return map2D(board, (field, r, c) => {
        const shouldRevealField =
            isSameBoardPosition({ row, col }, { r, c }) ||
            hasNoNeighbouringMines(revealedField) &&
            hasSameGroupName(field, revealedField)

        return shouldRevealField
            ? reveal(field)
            : { ...field };
    })
};

const calculateNeighbouringMines = (board) =>
    map2D(board, (field, row, column) => {
        const amount = neighbourPositionOffsets.reduce((noOfMines, [rowOffset, columnOffset]) => {
            const field = getField(board, row + rowOffset, column + columnOffset);
            noOfMines += field && isMine(field) ? 1 : 0;
            return noOfMines
        }, 0);
        return setNeighbouringMines(field, amount)
    });

// TODO: This mutates original board
const traverseNeighbouringFields = (board, row, column, groupName, traversalMap) => {
    traversalMap[row][column].visited = true;

    // TODO: Pass neighbour positions
    neighbourPositionOffsets.map(([rowOffset, columnOffset]) => {
        const neighbourRow = row + rowOffset
        const neighbourColumn = column + columnOffset;
        const neighbourField = getField(board, neighbourRow, neighbourColumn);
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
    const { rows, columns } = getDimensions2D(newBoard);
    let traversalMap = createBoard(rows, columns, { visited: false, groupName: null })

    for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
            const field = getField(newBoard, row, column);
            const isZeroIsland = field && !field.isMine && field.neighbouringMines === 0;
            if (isZeroIsland && !traversalMap[row][column].visited) {
                const groupName = Math.random().toString(36).substr(3, 5);
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
