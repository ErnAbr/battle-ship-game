export const calculateShipCoordinates = (
  startCoordinate,
  size,
  isHorizontal = true
) => {
  const row = startCoordinate.charAt(0);
  const col = parseInt(startCoordinate.slice(1), 10);

  let shipCoordinates = [];

  if (isHorizontal) {
    // Horizontal placement
    for (let i = 0; i < size; i++) {
      shipCoordinates.push(`${row}${col + i}`);
    }
  } else {
    // Vertical placement
    const newRowStart = row.charCodeAt(0);
    for (let i = 0; i < size; i++) {
      const newRow = String.fromCharCode(newRowStart + i);
      shipCoordinates.push(`${newRow}${col}`);
    }
  }

  return shipCoordinates;
};

export const isValidPlacement = (shipCoordinates, placedShips) => {
  return shipCoordinates.every((coord) => !placedShips.includes(coord));
};
