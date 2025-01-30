import { useState, useEffect, useCallback, useMemo } from "react";
import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { Ship } from "../../components/Ship/Ship.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";
import styles from "./homepage.module.scss";
import { Button } from "@mui/material";
import { useAppStore } from "../../context/store.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:3005");

export const Homepage = () => {
  const initialAvailableShips = useMemo(
    () => [
      { size: 2, id: 1 },
      { size: 3, id: 2 },
      { size: 3, id: 3 },
      { size: 4, id: 4 },
      { size: 5, id: 5 },
    ],
    []
  );

  const [ships, setShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(initialAvailableShips);

  // simulated ship coordinates
  // need to setEnemyShips from Database
  // const [enemyShips, setEnemyShips] = useState(["A1", "A2", "B3", "C4", "D5"]);
  const [enemyShips, setEnemyShips] = useState([]);
  const [hits, setHits] = useState([]);
  const [misses, setMisses] = useState([]);
  const user = useAppStore((state) => state.user);

  //websocket logic
  // const gameId = "game-123";

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  //websocket logic end

  const startGame = () => {
    console.log("enemy ships", enemyShips);
    console.log("my ships", ships);
  };

  const handleShipPlacement = (shipId) => {
    setAvailableShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== shipId)
    );
  };

  const resetBoard = useCallback(() => {
    setShips([]);
    setAvailableShips(initialAvailableShips);
    setHits([]);
    setMisses([]);
    setEnemyShips([]);
  }, [initialAvailableShips]);

  const handleEnemyBoardClick = (coordinate) => {
    if (enemyShips.includes(coordinate)) {
      console.log(`Hit at ${coordinate}!`);
      setHits((prevHits) => [...prevHits, coordinate]);
    } else {
      console.log(`Miss at ${coordinate}`);
      setMisses((prevMisses) => [...prevMisses, coordinate]);
    }
  };

  useEffect(() => {
    const allHits = enemyShips.every((ship) => hits.includes(ship));

    if (allHits && enemyShips.length > 0) {
      setTimeout(() => {
        alert("Game Over! You win!");
        resetBoard();
      }, 200);
    }
  }, [hits, enemyShips, resetBoard]);

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
            onClick={startGame}
            color="success"
            variant="contained"
            disabled={availableShips.length > 0 || !user}
          >
            Ready
          </Button>
          <Button onClick={resetBoard} color="warning" variant="contained">
            Reset
          </Button>
        </div>
      </div>

      <GameBoard
        isEnemyBoard={true}
        onCellClick={handleEnemyBoardClick}
        hits={hits}
        misses={misses}
      />
    </SplitScreen>
  );
};
