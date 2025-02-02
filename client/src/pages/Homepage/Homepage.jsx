import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { GameBoard } from "../../components/GameBoard/GameBoard.jsx";
import { Ship } from "../../components/Ship/Ship.jsx";
import { SplitScreen } from "../../components/SplitScreen/SplitScreen.jsx";
import styles from "./homepage.module.scss";
import { Button, CircularProgress } from "@mui/material";
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
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
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
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3005");
    }

    socketRef.current.on("start-game", (enemyShipsData) => {
      setEnemyShips(enemyShipsData);
      setIsGameStarted(true);
      setIsWaiting(false);
    });

    socketRef.current.on("game-over", (result) => {
      console.log("result is", result);
      if (result === "win") {
        alert("Game Over! You win!");
      } else if (result === "lose") {
        alert("Game Over! You lose!");
      }
      resetBoard();
    });

    socketRef.current.on("your-turn", () => {
      alert("It's your turn!");
      setIsMyTurn(true);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [resetBoard]);

  const startGame = () => {
    if (availableShips.length === 0) {
      console.log("Sending ship data to server...");
      socket.emit("join-game", gameId, user, ships);
      setIsWaiting(true);
    }
  };

  //websocket logic end

  const handleShipPlacement = (shipId) => {
    setAvailableShips((prevShips) =>
      prevShips.filter((ship) => ship.id !== shipId)
    );
  };

  const socket = socketRef.current;

  const handleEnemyBoardClick = (coordinate) => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
    if (enemyShips.includes(coordinate)) {
      setHits((prevHits) => [...prevHits, coordinate]);
    } else {
      setMisses((prevMisses) => [...prevMisses, coordinate]);
    }

    socket.emit("hit", gameId, user, coordinate);
    setIsMyTurn(false);
  };

  if (!isGameStarted && isWaiting) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "50px",
        }}
      >
        <CircularProgress color="primary" />
        <p>Waiting for opponent to join...</p>
      </div>
    );
  }

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
