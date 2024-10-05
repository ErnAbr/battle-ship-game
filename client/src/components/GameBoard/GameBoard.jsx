import styles from "./gameBoard.module.scss";
import { useState } from "react";
import {
  calculateShipCoordinates,
  isValidPlacement,
} from "../../utils/helperFunctions.js";

export const GameBoard = ({ onShipPlaced }) => {
  const [ships, setShips] = useState([]);

  const handleDrop = (e, startCoordinate) => {
    const shipSize = parseInt(e.dataTransfer.getData("ship-size"), 10);
    const shipId = parseInt(e.dataTransfer.getData("ship-id"), 10);
    const isHorizontal = true;

    const newShipCoordinates = calculateShipCoordinates(
      startCoordinate,
      shipSize,
      isHorizontal
    );

    if (isValidPlacement(newShipCoordinates, ships)) {
      setShips((prevShips) => [...prevShips, ...newShipCoordinates]);

      onShipPlaced(shipId);
    } else {
      console.log("Invalid ship placement.");
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
        onClick={() => console.log(coordinate)}
        onDrop={(e) => handleDrop(e, coordinate)}
        onDragOver={handleDragOver}
      ></div>
    );
  });

  return <div className={styles.gridContainer}>{gridCells}</div>;
};
