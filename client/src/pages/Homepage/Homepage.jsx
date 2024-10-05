import { useState } from "react";
import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { Ship } from "../../components/Ship/Ship.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";
import styles from "./homepage.module.scss";

export const Homepage = () => {
  const [availableShips, setAvailableShips] = useState([
    { size: 2, id: 1 },
    { size: 3, id: 2 },
    { size: 3, id: 3 },
    { size: 4, id: 4 },
    { size: 5, id: 5 },
  ]);

  const handleShipPlacement = (shipId) => {
    setAvailableShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== shipId)
    );
  };

  return (
    <SplitScreen>
      <div>
        <GameBoard onShipPlaced={handleShipPlacement} />
        <div className={styles.shipSelectionBoard}>
          <h3>Place Your Ships:</h3>
          {availableShips.map((ship) => (
            <Ship key={ship.id} size={ship.size} id={ship.id} />
          ))}
        </div>
      </div>

      <GameBoard />
    </SplitScreen>
  );
};
