export const for2D = (rows, columns, fn) => {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            fn(i, j);
        }
    }
};

export const map2D = (origArray, fn) => {
    let newArr = [];
    origArray.map((row, rowIndex) => {
        const rowData = [];
        row.map((element, colIndex) =>
            rowData.push(fn(element, rowIndex, colIndex, origArray)))
        return newArr.push([...rowData]);
    });
    return newArr;
};

export const getRandomPositions = (amount, arrayLength) => {
    const positions = [];
    while (positions.length < amount) {
        const randPos = Math.floor(Math.random() * arrayLength);
        const isUnique = !positions.some(i => i === randPos)
        if (isUnique) {
            positions.push(randPos);
        }
    }
    return positions;
}

export const to2DArray = (array, columns) => {
    let row = [];
    return array.reduce((array2D, field, index) => {
        row.push({ ...field })
        if ((index + 1) % columns === 0) {
            array2D.push(row);
            row = [];
        }
        return array2D;
    }, []);
};

export const convertTo1DPos = (row, col, colSize) => row * colSize + col;
