import { useState } from "react";
import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { Ship } from "../../components/Ship/Ship.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";
import styles from "./homepage.module.scss";
import { Button } from "@mui/material";

export const Homepage = () => {
  const initialAvailableShips = [
    { size: 2, id: 1 },
    { size: 3, id: 2 },
    { size: 3, id: 3 },
    { size: 4, id: 4 },
    { size: 5, id: 5 },
  ];

  const [ships, setShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(initialAvailableShips);

  const handleShipPlacement = (shipId) => {
    setAvailableShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== shipId)
    );
  };

  const resetBoard = () => {
    setShips([]);
    setAvailableShips(initialAvailableShips);
  };

  return (
    <SplitScreen>
      <div>
        <GameBoard
          setShips={setShips}
          ships={ships}
          onShipPlaced={handleShipPlacement}
        />
        <div className={styles.shipSelectionBoard}>
          <h3>Place Your Ships:</h3>

          {availableShips.map((ship) => (
            <Ship key={ship.id} size={ship.size} id={ship.id} />
          ))}
          <Button
            onClick={() => console.log("ready")}
            color="success"
            variant="contained"
          >
            Ready
          </Button>
          <Button onClick={resetBoard} color="warning" variant="contained">
            Reset
          </Button>
        </div>
      </div>

      <GameBoard isEnemyBoard={true} />
    </SplitScreen>
  );
};
