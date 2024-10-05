import styles from "./gameBoard.module.scss";
import {
  calculateShipCoordinates,
  isValidCoordinate,
} from "../../utils/helperFunctions.js";
import { toast } from "react-toastify";

export const GameBoard = ({
  onShipPlaced,
  ships = [],
  setShips,
  isEnemyBoard,
}) => {
  const handleDrop = (e, startCoordinate) => {
    const shipSize = parseInt(e.dataTransfer.getData("ship-size"), 10);
    const isHorizontal = e.dataTransfer.getData("is-horizontal") === "true";

    if (isEnemyBoard) {
      toast.error("You cannot place ships on the enemy board!");
      return;
    }

    const newShipCoordinates = calculateShipCoordinates(
      startCoordinate,
      shipSize,
      isHorizontal
    );

    if (
      newShipCoordinates.length === 0 ||
      newShipCoordinates.some((coord) => !isValidCoordinate(coord))
    ) {
      toast.warning("Invalid ship placement. Out of bounds.");
      return;
    }

    if (newShipCoordinates.every((coordinate) => !ships.includes(coordinate))) {
      setShips((prevShips) => [...prevShips, ...newShipCoordinates]);

      const shipId = parseInt(e.dataTransfer.getData("ship-id"), 10);
      onShipPlaced(shipId);
    } else {
      toast.warning("Invalid ship placement. Overlapping existing ships.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const gridCells = [...Array(100)].map((_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 10));
    const col = (index % 10) + 1;
    const coordinate = `${row}${col}`;

    const isShip = ships.includes(coordinate);

    return (
      <div
        key={coordinate}
        className={`${styles.gridCell} ${isShip ? styles.shipCell : ""}`}
        onDrop={(e) => handleDrop(e, coordinate)}
        onDragOver={handleDragOver}
      ></div>
    );
  });

  return <div className={styles.gridContainer}>{gridCells}</div>;
};
