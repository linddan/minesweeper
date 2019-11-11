import { neighbourPositionOffsets, getNeighbourPositionOffsets } from "./board.constants";
import { compose, pipe } from "../../utils/fn.utils";
import { getRandomPositions, to2DArray } from "../../utils/array.utils";
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
} from '../field/field.util';


// const createFieldUpdater = (field) => (fieldOp) => fieldOp(field)

const createBoardUpdater = (board) => (position, fieldOp) =>
    board.map((field, index) =>
        index === position ? fieldOp(field) : { ...field });

//
// Board functions
//
const getField = (board, pos) => board[pos] ? { ...board[pos] } : null;

export const createBoard = (
    noOfFields,
    defaultField = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighbouringMines: 0,
        groupName: null,
    }) => new Array(noOfFields).fill({ ...defaultField });

const cloneBoard = board => board.map(field => ({ ...field }));

export const revealAllFields = (board) => board.map(reveal);

export const createBoardInitializer = (noOfMines) =>
    compose(
        calculateIslands,
        calculateNeighbouringMines,
        createMinePlacer(noOfMines),
    )

const createMinePlacer = noOfMines => board => {
    const minePositions = getRandomPositions(noOfMines, board.length);
    return board.map((field, position) =>
        (minePositions.includes(position))
            ? placeMine(field)
            : { ...field }
    );
};

const calculateNeighbouringMines = board => {
    const newBoard = to2DArray(board, 8); // remove hard coding
    newBoard.map((row, rowIndex) => {
        return row.map((field, columnIndex) => {
            const neighbouringMines =
                neighbourPositionOffsets.reduce((noOfMines, [rowOffset, columnOffset]) => {
                    const neighbouringField = getField(board, rowIndex + rowOffset, columnIndex + columnOffset);
                    noOfMines += neighbouringField && isMine(neighbouringField) ? 1 : 0;
                    return noOfMines;
                }, 0);
            return setNeighbouringMines(field, neighbouringMines);
        });
    });
    console.log(newBoard)
    return newBoard.flat();
};

const calculateNeighbouringMines2 = board =>
    board.map((field, pos) => {
        const neighbouringMines =
            getNeighbourPositionOffsets(8).reduce((noOfMines, posOffset) => {
                const neighbouringField = getField(board, pos + posOffset);
                noOfMines += isValidField(neighbouringField) && isMine(neighbouringField) ? 1 : 0;
                return noOfMines;
            }, 0);
        return setNeighbouringMines(field, neighbouringMines);
    });

// TODO: This mutates original board
const traverseNeighbouringFields = (board, pos, groupName, traversalMap) => {
    traversalMap[pos].visited = true;

    // TODO: Pass neighbour positions
    getNeighbourPositionOffsets(8).forEach(posOffset => {
        const neighbourField = getField(board, pos + posOffset);
        console.log({ neighbourField })
        const isNeighbourPartOfIsland =
            neighbourField
            && !traversalMap[pos + posOffset].visited
            && getNeighbouringMines(neighbourField) === 0;

        if (isNeighbourPartOfIsland) {
            traversalMap[pos].groupName = groupName;
            traversalMap = traverseNeighbouringFields(board, posOffset, groupName, traversalMap);
        }
    });
    return traversalMap;
}

export const calculateIslands = (board) => {
    const newBoard = cloneBoard(board);
    let traversalMap = createBoard(board.length, { visited: false, groupName: null })

    newBoard.forEach((field, position) => {
        const isZeroIsland = field && !field.isMine && field.neighbouringMines === 0;
        const isNotVisited = !traversalMap[position].visited;

        if (isZeroIsland && isNotVisited) {
            const groupName = Math.random().toString(36).substr(2, 5);
            traversalMap[position].groupName = groupName;
            traversalMap[position].visited = true;
            traversalMap = traverseNeighbouringFields(newBoard, position, groupName, traversalMap);
        } else {
            traversalMap[position].visited = true;
        }
    });

    newBoard.forEach((field, index) => {
        if (traversalMap[index].groupName) {
            newBoard[index].groupName = traversalMap[index].groupName
        }
    });

    return newBoard;
};

export const isGameWon = (board) =>
    board.every((field) =>
        isMine(field)
            ? !isRevealed(field)
            : isRevealed(field)
    );

export const isGameLost = (board) =>
    board.some((field) =>
        isMine(field)
            ? isRevealed(field)
            : false
    );

export const revealFieldAtPos = (board, pos) => {
    const revealedField = getField(board, pos);
    return board.map((field, index) => {
        if (index === pos ||
            getNeighbouringMines(revealedField) === 0 &&
            getGroupName(field) === getGroupName(revealedField)) {
            return reveal(field);
        }
        return { ...field };
    })
};

export const flagField = (board, pos) =>
    createBoardUpdater(board)(pos, toggleFlagged)