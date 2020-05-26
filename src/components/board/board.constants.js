export const LEFT_MOUSE_BUTTON = 1;
export const RIGHT_MOUSE_BUTTON = 3;

export const neighborPositionOffsets = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const getNeighborPositionOffsets = (columns) => [
  -columns - 1,
  -columns,
  -columns + 1,
  -1,
  1,
  columns - 1,
  columns,
  columns + 1,
];
