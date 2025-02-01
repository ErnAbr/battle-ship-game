import { useState, useEffect, useCallback, useMemo } from "react";
import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { Ship } from "../../components/Ship/Ship.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";
import styles from "./homepage.module.scss";
import { Button } from "@mui/material";
import { useAppStore } from "../../context/store.js";
import { io } from "socket.io-client";

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
  const [enemyShips, setEnemyShips] = useState([]);
  const [hits, setHits] = useState([]);
  const [misses, setMisses] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const user = useAppStore((state) => state.user);

  const resetBoard = useCallback(() => {
    setShips([]);
    setAvailableShips(initialAvailableShips);
    setHits([]);
    setMisses([]);
    setEnemyShips([]);
    setIsGameStarted(false);
  }, [initialAvailableShips]);

  //websocket logic
  const gameId = "game-123";
  const socket = io("http://localhost:3005");
  useEffect(() => {
    socket.on("start-game", (enemyShipsData) => {
      console.log("Game started with enemy ships:", enemyShipsData);
      setEnemyShips(enemyShipsData);
      setIsGameStarted(true);
    });

    socket.on("game-over", (result) => {
      if (result === "win") {
        alert("Game Over! You win!");
      } else if (result === "lose") {
        alert("Game Over! You lose!");
        resetBoard();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, resetBoard]);

  const startGame = () => {
    if (availableShips.length === 0) {
      console.log("Sending ship data to server...");
      socket.emit("join-game", gameId, user, ships);
    }
  };

  //websocket logic end

  const handleShipPlacement = (shipId) => {
    setAvailableShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== shipId)
    );
  };

  const handleEnemyBoardClick = (coordinate) => {
    if (enemyShips.includes(coordinate)) {
      console.log(`Hit at ${coordinate}!`);
      setHits((prevHits) => [...prevHits, coordinate]);
      socket.emit("hit", gameId, user, coordinate);
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
            disabled={availableShips.length > 0 || !user || isGameStarted}
          >
            Ready
          </Button>
          <Button
            onClick={resetBoard}
            color="warning"
            variant="contained"
            disabled={isGameStarted}
          >
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
