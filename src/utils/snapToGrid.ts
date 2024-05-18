export const snapToGrid = (value: number, gridSize: number = 0.5) => {
    return Math.round(value / gridSize) * gridSize;
  };
  