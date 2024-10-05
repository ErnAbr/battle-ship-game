export const calculateShipCoordinates = (
  startCoordinate,
  size,
  isHorizontal = true
) => {
  const row = startCoordinate.charAt(0);
  const col = parseInt(startCoordinate.slice(1), 10);

  let shipCoordinates = [];

  if (isHorizontal) {
    const lastCol = col + size - 1;

    if (lastCol > 10) return [];

    for (let i = 0; i < size; i++) {
      shipCoordinates.push(`${row}${col + i}`);
    }
  } else {
    const lastRow = String.fromCharCode(row.charCodeAt(0) + size - 1);

    if (lastRow.charCodeAt(0) > "J".charCodeAt(0)) return [];

    for (let i = 0; i < size; i++) {
      const newRow = String.fromCharCode(row.charCodeAt(0) + i);
      shipCoordinates.push(`${newRow}${col}`);
    }
  }

  return shipCoordinates;
};
