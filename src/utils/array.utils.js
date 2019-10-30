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

export const getRandomPositions2D = (amount, sizeX, sizeY) => {
  const positions = [];
  while (positions.length < amount) {
    const x = Math.floor(Math.random() * sizeX);
    const y = Math.floor(Math.random() * sizeY);
    const isUnique = !positions.some(([i, j]) => x === i && y === j)
    if (isUnique) {
      positions.push([x, y]);
    }
  }
  return positions;
}

// Mention they have to be of equal lenght
export const getDimensions2D = (arr) => [arr.length, arr[0].length];

export const isPosValid2D = (arr, x, y) => arr[x] && arr[x][y]

export const getFieldAtPos = (arr, x, y) =>
  isPosValid2D(arr, x, y)
    ? arr[x][y]
    : null;